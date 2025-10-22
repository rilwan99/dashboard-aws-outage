// API Route: GET /api/blocks
// List recent cached blocks and cache statistics

import { NextRequest, NextResponse } from 'next/server';
import { getRecentBlocks, getCacheStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get recent blocks from cache
    const recentBlocks = getRecentBlocks(Math.min(limit, 100)); // Max 100 blocks

    // Get cache statistics
    const stats = getCacheStats();

    return NextResponse.json({
      stats,
      recentBlocks: recentBlocks.map(block => ({
        slot: block.block_slot,
        blockHeight: block.block_height,
        blockTime: block.block_time,
        transactionCount: block.transaction_count,
        blockhash: block.blockhash,
        cachedAt: block.created_at,
      })),
      count: recentBlocks.length,
    });
  } catch (error: any) {
    console.error('Error fetching blocks list:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blocks',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
