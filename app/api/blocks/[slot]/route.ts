// API Route: GET /api/blocks/[slot]
// Fetch block data by slot number with database caching

import { NextRequest, NextResponse } from 'next/server';
import { solanaClient } from '@/lib/solana/client';
import { getBlockBySlot, upsertBlock, logApiRequest, BlockData } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  const startTime = Date.now();
  const { slot: slotParam } = await params;
  const slot = parseInt(slotParam, 10);

  // Validate slot parameter
  if (isNaN(slot) || slot < 0) {
    const responseTime = Date.now() - startTime;
    logApiRequest({
      endpoint: `/api/blocks/${slotParam}`,
      method: 'GET',
      block_slot: undefined,
      cache_hit: false,
      response_time_ms: responseTime,
      status_code: 400,
      error_message: 'Invalid slot parameter',
    });

    return NextResponse.json(
      { error: 'Invalid slot parameter. Must be a positive integer.' },
      { status: 400 }
    );
  }

  try {
    // Check if block data exists in cache
    let cachedBlock = getBlockBySlot(slot);
    let cacheHit = false;

    if (cachedBlock) {
      // Return cached data
      cacheHit = true;
      const responseTime = Date.now() - startTime;

      logApiRequest({
        endpoint: `/api/blocks/${slot}`,
        method: 'GET',
        block_slot: slot,
        cache_hit: true,
        response_time_ms: responseTime,
        status_code: 200,
      });

      return NextResponse.json({
        slot: cachedBlock.block_slot,
        blockHeight: cachedBlock.block_height,
        blockTime: cachedBlock.block_time,
        blockhash: cachedBlock.blockhash,
        previousBlockhash: cachedBlock.previous_blockhash,
        parentSlot: cachedBlock.parent_slot,
        transactionCount: cachedBlock.transaction_count,
        rewards: cachedBlock.rewards ? JSON.parse(cachedBlock.rewards) : null,
        cached: true,
        cachedAt: cachedBlock.created_at,
      });
    }

    // Fetch from Solana RPC
    const blockInfo = await solanaClient.getBlockInfo(slot);

    // Store in database
    const blockData: BlockData = {
      block_slot: slot,
      block_height: blockInfo.blockHeight || undefined,
      block_time: blockInfo.blockTime || undefined,
      parent_slot: blockInfo.parentSlot,
      transaction_count: blockInfo.transactionCount,
      blockhash: blockInfo.blockhash,
      previous_blockhash: blockInfo.previousBlockhash,
      rewards: blockInfo.rewards ? JSON.stringify(blockInfo.rewards) : undefined,
    };

    const { cacheHit: wasInCache } = upsertBlock(blockData);
    const responseTime = Date.now() - startTime;

    logApiRequest({
      endpoint: `/api/blocks/${slot}`,
      method: 'GET',
      block_slot: slot,
      cache_hit: false,
      response_time_ms: responseTime,
      status_code: 200,
    });

    return NextResponse.json({
      slot: blockInfo.slot,
      blockHeight: blockInfo.blockHeight,
      blockTime: blockInfo.blockTime,
      blockhash: blockInfo.blockhash,
      previousBlockhash: blockInfo.previousBlockhash,
      parentSlot: blockInfo.parentSlot,
      transactionCount: blockInfo.transactionCount,
      rewards: blockInfo.rewards,
      cached: false,
      fetchedAt: Date.now(),
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error(`Error fetching block ${slot}:`, error);

    logApiRequest({
      endpoint: `/api/blocks/${slot}`,
      method: 'GET',
      block_slot: slot,
      cache_hit: false,
      response_time_ms: responseTime,
      status_code: 500,
      error_message: error.message,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch block data',
        message: error.message,
        slot,
      },
      { status: 500 }
    );
  }
}
