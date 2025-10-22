// API Route: GET /api/stats
// Get cache statistics and API performance metrics

import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats: {
        totalCachedBlocks: stats.total_cached_blocks,
        lastHour: {
          totalRequests: stats.last_hour.total_requests,
          cacheHits: stats.last_hour.cache_hits,
          cacheMisses: stats.last_hour.total_requests - stats.last_hour.cache_hits,
          cacheHitRate: `${stats.last_hour.cache_hit_rate}%`,
          avgResponseTimeMs: stats.last_hour.avg_response_time_ms,
        },
      },
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
