// API Route: GET /api/blocks/current
// Get current slot and optionally fetch its block data

import { NextRequest, NextResponse } from 'next/server';
import { solanaClient } from '@/lib/solana/client';
import { getBlockBySlot, upsertBlock, logApiRequest, BlockData } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const fetchBlock = searchParams.get('fetchBlock') === 'true';

  try {
    // Get current slot
    const currentSlot = await solanaClient.getCurrentSlot();

    if (!fetchBlock) {
      const responseTime = Date.now() - startTime;
      return NextResponse.json({
        currentSlot,
        timestamp: Date.now(),
      });
    }

    // Fetch current block data
    let cachedBlock = getBlockBySlot(currentSlot);
    let cacheHit = false;

    if (cachedBlock) {
      cacheHit = true;
      const responseTime = Date.now() - startTime;

      logApiRequest({
        endpoint: '/api/blocks/current',
        method: 'GET',
        block_slot: currentSlot,
        cache_hit: true,
        response_time_ms: responseTime,
        status_code: 200,
      });

      return NextResponse.json({
        currentSlot,
        slot: cachedBlock.block_slot,
        blockHeight: cachedBlock.block_height,
        blockTime: cachedBlock.block_time,
        blockhash: cachedBlock.blockhash,
        previousBlockhash: cachedBlock.previous_blockhash,
        transactionCount: cachedBlock.transaction_count,
        cached: true,
        cachedAt: cachedBlock.created_at,
      });
    }

    // Fetch from Solana RPC
    const blockInfo = await solanaClient.getBlockInfo(currentSlot);

    // Store in database
    const blockData: BlockData = {
      block_slot: currentSlot,
      block_height: blockInfo.blockHeight || undefined,
      block_time: blockInfo.blockTime || undefined,
      parent_slot: blockInfo.parentSlot,
      transaction_count: blockInfo.transactionCount,
      blockhash: blockInfo.blockhash,
      previous_blockhash: blockInfo.previousBlockhash,
      rewards: blockInfo.rewards ? JSON.stringify(blockInfo.rewards) : undefined,
    };

    upsertBlock(blockData);
    const responseTime = Date.now() - startTime;

    logApiRequest({
      endpoint: '/api/blocks/current',
      method: 'GET',
      block_slot: currentSlot,
      cache_hit: false,
      response_time_ms: responseTime,
      status_code: 200,
    });

    return NextResponse.json({
      currentSlot,
      slot: blockInfo.slot,
      blockHeight: blockInfo.blockHeight,
      blockTime: blockInfo.blockTime,
      blockhash: blockInfo.blockhash,
      previousBlockhash: blockInfo.previousBlockhash,
      transactionCount: blockInfo.transactionCount,
      cached: false,
      fetchedAt: Date.now(),
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('Error fetching current slot:', error);

    logApiRequest({
      endpoint: '/api/blocks/current',
      method: 'GET',
      cache_hit: false,
      response_time_ms: responseTime,
      status_code: 500,
      error_message: error.message,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch current slot',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
