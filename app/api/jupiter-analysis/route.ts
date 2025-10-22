// API Route: GET /api/jupiter-analysis
// Analyze Jupiter swap program transactions during the outage period and compare with before/after periods
// Jupiter Program ID: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4

import { NextResponse } from 'next/server';
import { solanaClient } from '@/lib/solana/client';

// Jupiter swap program address
const JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';

// Outage period: October 20, 2025, 6:30 AM - 9:30 AM UTC (3 hours)
// Using block slots
const OUTAGE_PERIOD = {
  epoch: 867,
  startSlot: 374563500,
  endSlot: 374591000,
  startTime: '2025-10-20T06:30:00Z',
  endTime: '2025-10-20T09:30:00Z',
  durationHours: 3,
};

export async function GET() {
  const startTime = Date.now();

  // Sample size for consistent analysis (smaller for program-specific queries)
  const sampleSize = 50; // Reduced sample size due to more expensive queries

  try {
    // Calculate slot ranges for comparison
    const outageSlotRange = OUTAGE_PERIOD.endSlot - OUTAGE_PERIOD.startSlot;

    // Pre-outage period: 3 hours before outage (same number of slots)
    const preOutageStart = OUTAGE_PERIOD.startSlot - outageSlotRange;
    const preOutageEnd = OUTAGE_PERIOD.startSlot;

    // During outage
    const duringOutageStart = OUTAGE_PERIOD.startSlot;
    const duringOutageEnd = OUTAGE_PERIOD.endSlot;

    // Post-outage period: 3 hours after outage (same number of slots)
    const postOutageStart = OUTAGE_PERIOD.endSlot;
    const postOutageEnd = OUTAGE_PERIOD.endSlot + outageSlotRange;

    console.log(`Analyzing Jupiter program impact (${JUPITER_PROGRAM_ID})...`);
    console.log(`Pre-outage: ${preOutageStart} - ${preOutageEnd}`);
    console.log(`During outage: ${duringOutageStart} - ${duringOutageEnd}`);
    console.log(`Post-outage: ${postOutageStart} - ${postOutageEnd}`);

    // Fetch data for all three periods in parallel
    const [preOutageData, duringOutageData, postOutageData] = await Promise.all([
      solanaClient.analyzeProgramBlockRange(preOutageStart, preOutageEnd, JUPITER_PROGRAM_ID, sampleSize),
      solanaClient.analyzeProgramBlockRange(duringOutageStart, duringOutageEnd, JUPITER_PROGRAM_ID, sampleSize),
      solanaClient.analyzeProgramBlockRange(postOutageStart, postOutageEnd, JUPITER_PROGRAM_ID, sampleSize),
    ]);

    // Calculate metrics
    const calculateMetrics = (data: any) => ({
      totalBlocksSampled: data.totalBlocksSampled,
      totalJupiterTransactions: data.totalProgramTransactions,
      totalNetworkTransactions: data.totalNetworkTransactions,
      averageJupiterTransactionsPerBlock: data.averageProgramTransactionsPerBlock,
      averageNetworkTransactionsPerBlock: data.averageNetworkTransactionsPerBlock,
      jupiterPercentageOfNetwork: data.programPercentage,
      minJupiterTransactions: data.minProgramTransactions,
      maxJupiterTransactions: data.maxProgramTransactions,
      estimatedTotalJupiterTransactions: Math.floor(
        data.averageProgramTransactionsPerBlock * (data.endSlot - data.startSlot)
      ),
      cacheHits: data.cacheHits || 0,
      cacheMisses: data.cacheMisses || 0,
    });

    const preMetrics = calculateMetrics(preOutageData);
    const duringMetrics = calculateMetrics(duringOutageData);
    const postMetrics = calculateMetrics(postOutageData);

    // Calculate percentage changes
    const calculateChange = (current: number, baseline: number) => {
      if (baseline === 0) return 0;
      return ((current - baseline) / baseline) * 100;
    };

    const jupiterTxPerBlockChange = calculateChange(
      duringMetrics.averageJupiterTransactionsPerBlock,
      preMetrics.averageJupiterTransactionsPerBlock
    );

    const totalJupiterTxChange = calculateChange(
      duringMetrics.estimatedTotalJupiterTransactions,
      preMetrics.estimatedTotalJupiterTransactions
    );

    const jupiterMarketShareChange = calculateChange(
      duringMetrics.jupiterPercentageOfNetwork,
      preMetrics.jupiterPercentageOfNetwork
    );

    // Detect disruption
    const disruptionDetected = jupiterTxPerBlockChange < -10; // More than 10% drop
    const disruptionSeverity =
      jupiterTxPerBlockChange < -50
        ? 'critical'
        : jupiterTxPerBlockChange < -30
        ? 'high'
        : jupiterTxPerBlockChange < -10
        ? 'medium'
        : 'low';

    // Recovery analysis
    const recoveryRate = calculateChange(
      postMetrics.averageJupiterTransactionsPerBlock,
      preMetrics.averageJupiterTransactionsPerBlock
    );

    const fullyRecovered = Math.abs(recoveryRate) < 5; // Within 5% of pre-outage levels

    const responseTime = Date.now() - startTime;

    // Calculate cache statistics
    const totalCacheHits = preMetrics.cacheHits + duringMetrics.cacheHits + postMetrics.cacheHits;
    const totalCacheMisses = preMetrics.cacheMisses + duringMetrics.cacheMisses + postMetrics.cacheMisses;
    const cacheHitRate = totalCacheHits + totalCacheMisses > 0
      ? ((totalCacheHits / (totalCacheHits + totalCacheMisses)) * 100).toFixed(2)
      : '0.00';

    return NextResponse.json({
      success: true,
      program: {
        name: 'Jupiter',
        address: JUPITER_PROGRAM_ID,
        description: 'Solana swap aggregator',
      },
      outagePeriod: {
        epoch: OUTAGE_PERIOD.epoch,
        startSlot: OUTAGE_PERIOD.startSlot,
        endSlot: OUTAGE_PERIOD.endSlot,
        startTime: OUTAGE_PERIOD.startTime,
        endTime: OUTAGE_PERIOD.endTime,
        durationHours: OUTAGE_PERIOD.durationHours,
      },
      analysis: {
        disruptionDetected,
        disruptionSeverity,
        fullyRecovered,
        jupiterTransactionDropPercentage: jupiterTxPerBlockChange.toFixed(2),
        estimatedJupiterTransactionLoss: Math.max(
          0,
          preMetrics.estimatedTotalJupiterTransactions - duringMetrics.estimatedTotalJupiterTransactions
        ),
        marketShareImpact: jupiterMarketShareChange.toFixed(2),
      },
      periods: {
        preOutage: {
          timeRange: '3 hours before outage',
          slotRange: { start: preOutageStart, end: preOutageEnd },
          metrics: preMetrics,
        },
        duringOutage: {
          timeRange: 'During outage (3 hours)',
          slotRange: { start: duringOutageStart, end: duringOutageEnd },
          metrics: duringMetrics,
          changeFromBaseline: {
            avgJupiterTransactionsPerBlock: `${jupiterTxPerBlockChange.toFixed(2)}%`,
            totalJupiterTransactions: `${totalJupiterTxChange.toFixed(2)}%`,
            jupiterMarketShare: `${jupiterMarketShareChange.toFixed(2)}%`,
          },
        },
        postOutage: {
          timeRange: '3 hours after outage',
          slotRange: { start: postOutageStart, end: postOutageEnd },
          metrics: postMetrics,
          recoveryRate: `${recoveryRate.toFixed(2)}%`,
        },
      },
      comparison: {
        preVsDuring: {
          avgJupiterTransactionsPerBlock: {
            pre: preMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            during: duringMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            change: `${jupiterTxPerBlockChange.toFixed(2)}%`,
          },
          totalJupiterTransactions: {
            pre: preMetrics.estimatedTotalJupiterTransactions,
            during: duringMetrics.estimatedTotalJupiterTransactions,
            change: `${totalJupiterTxChange.toFixed(2)}%`,
          },
          jupiterMarketShare: {
            pre: `${preMetrics.jupiterPercentageOfNetwork.toFixed(2)}%`,
            during: `${duringMetrics.jupiterPercentageOfNetwork.toFixed(2)}%`,
            change: `${jupiterMarketShareChange.toFixed(2)}%`,
          },
        },
        duringVsPost: {
          avgJupiterTransactionsPerBlock: {
            during: duringMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            post: postMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            change: `${calculateChange(
              postMetrics.averageJupiterTransactionsPerBlock,
              duringMetrics.averageJupiterTransactionsPerBlock
            ).toFixed(2)}%`,
          },
        },
        preVsPost: {
          avgJupiterTransactionsPerBlock: {
            pre: preMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            post: postMetrics.averageJupiterTransactionsPerBlock.toFixed(2),
            change: `${recoveryRate.toFixed(2)}%`,
          },
          recovered: fullyRecovered,
        },
      },
      metadata: {
        sampleSize,
        totalBlocksAnalyzed:
          preMetrics.totalBlocksSampled +
          duringMetrics.totalBlocksSampled +
          postMetrics.totalBlocksSampled,
        cacheStatistics: {
          totalCacheHits,
          totalCacheMisses,
          cacheHitRate: `${cacheHitRate}%`,
        },
        analysisTimeMs: responseTime,
        timestamp: Date.now(),
        note: 'Analysis filters transactions by Jupiter program ID. Cache is checked first for all queries.',
      },
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('Error analyzing Jupiter program during outage period:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze Jupiter program outage impact',
        message: error.message,
        metadata: {
          analysisTimeMs: responseTime,
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}
