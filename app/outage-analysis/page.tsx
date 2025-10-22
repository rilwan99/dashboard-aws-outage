'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, TrendingUp, Activity, Clock, BarChart3, CheckCircle2, XCircle, Database } from 'lucide-react';

export default function OutageAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-run analysis on page load
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/outage-analysis');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run analysis');
      }

      setAnalysisData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold tracking-tight">Outage Period Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Comparing transaction volumes before, during, and after the AWS outage
          </p>
        </div>

        {/* Outage Period Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Outage Period Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date</div>
                <div className="font-semibold">October 20, 2025</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time (UTC)</div>
                <div className="font-semibold">6:30 AM - 9:30 AM</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Duration</div>
                <div className="font-semibold">3 hours</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Epoch</div>
                <div className="font-semibold">867</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Start Block</div>
                <div className="font-mono font-semibold">374,563,500</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">End Block</div>
                <div className="font-mono font-semibold">374,591,000</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 py-8">
                <Activity className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-lg text-muted-foreground">
                  Analyzing blockchain data across three 3-hour periods...
                </p>
              </div>
              <div className="text-sm text-center text-muted-foreground">
                This may take 30-60 seconds depending on cache hit rate
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Error: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisData && analysisData.success && !loading && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disruption Detected</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {analysisData.analysis.disruptionDetected ? (
                      <>
                        <XCircle className="h-6 w-6 text-red-500" />
                        Yes
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        No
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getSeverityBadge(analysisData.analysis.disruptionSeverity)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Drop</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {analysisData.analysis.transactionDropPercentage}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    During outage vs baseline
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Loss</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analysisData.analysis.estimatedTransactionLoss)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transactions not processed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recovery Status</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {analysisData.analysis.fullyRecovered ? (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        Full
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                        Partial
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Post-outage recovery
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Period Comparison */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Pre-Outage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pre-Outage</CardTitle>
                  <CardDescription>3 hours before outage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Avg Tx/Block</div>
                    <div className="text-xl font-bold">
                      {parseFloat(analysisData.comparison.preVsDuring.avgTransactionsPerBlock.pre).toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                    <div className="text-xl font-bold">
                      {formatNumber(analysisData.periods.preOutage.metrics.estimatedTotalTransactions)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Blocks Sampled</div>
                    <div className="text-lg">
                      {analysisData.periods.preOutage.metrics.totalBlocksSampled}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baseline</Badge>
                </CardContent>
              </Card>

              {/* During Outage */}
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    During Outage
                  </CardTitle>
                  <CardDescription>3-hour outage period</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Avg Tx/Block</div>
                    <div className="text-xl font-bold text-red-500">
                      {parseFloat(analysisData.comparison.preVsDuring.avgTransactionsPerBlock.during).toFixed(0)}
                    </div>
                    <div className="text-sm font-semibold text-red-500">
                      {analysisData.periods.duringOutage.changeFromBaseline.avgTransactionsPerBlock}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                    <div className="text-xl font-bold">
                      {formatNumber(analysisData.periods.duringOutage.metrics.estimatedTotalTransactions)}
                    </div>
                    <div className="text-sm font-semibold text-red-500">
                      {analysisData.periods.duringOutage.changeFromBaseline.totalTransactions}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Blocks Sampled</div>
                    <div className="text-lg">
                      {analysisData.periods.duringOutage.metrics.totalBlocksSampled}
                    </div>
                  </div>
                  {getSeverityBadge(analysisData.analysis.disruptionSeverity)}
                </CardContent>
              </Card>

              {/* Post-Outage */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post-Outage</CardTitle>
                  <CardDescription>3 hours after outage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Avg Tx/Block</div>
                    <div className="text-xl font-bold">
                      {parseFloat(analysisData.comparison.preVsPost.avgTransactionsPerBlock.post).toFixed(0)}
                    </div>
                    <div className={`text-sm font-semibold ${
                      parseFloat(analysisData.comparison.preVsPost.avgTransactionsPerBlock.change) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {analysisData.comparison.preVsPost.avgTransactionsPerBlock.change}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                    <div className="text-xl font-bold">
                      {formatNumber(analysisData.periods.postOutage.metrics.estimatedTotalTransactions)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Blocks Sampled</div>
                    <div className="text-lg">
                      {analysisData.periods.postOutage.metrics.totalBlocksSampled}
                    </div>
                  </div>
                  {analysisData.comparison.preVsPost.recovered ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Recovered
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Partial Recovery
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>Transaction metrics across all periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Metric</th>
                        <th className="text-right p-2">Pre-Outage</th>
                        <th className="text-right p-2">During Outage</th>
                        <th className="text-right p-2">Post-Outage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Avg Tx/Block</td>
                        <td className="p-2 text-right">
                          {analysisData.comparison.preVsDuring.avgTransactionsPerBlock.pre}
                        </td>
                        <td className="p-2 text-right text-red-500 font-semibold">
                          {analysisData.comparison.preVsDuring.avgTransactionsPerBlock.during}
                          <span className="text-xs ml-1">
                            ({analysisData.comparison.preVsDuring.avgTransactionsPerBlock.change})
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {analysisData.comparison.preVsPost.avgTransactionsPerBlock.post}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Est. Total Transactions</td>
                        <td className="p-2 text-right">
                          {formatNumber(analysisData.comparison.preVsDuring.totalTransactions.pre)}
                        </td>
                        <td className="p-2 text-right text-red-500 font-semibold">
                          {formatNumber(analysisData.comparison.preVsDuring.totalTransactions.during)}
                          <span className="text-xs ml-1">
                            ({analysisData.comparison.preVsDuring.totalTransactions.change})
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {formatNumber(analysisData.periods.postOutage.metrics.estimatedTotalTransactions)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Blocks Sampled</td>
                        <td className="p-2 text-right">
                          {analysisData.periods.preOutage.metrics.totalBlocksSampled}
                        </td>
                        <td className="p-2 text-right">
                          {analysisData.periods.duringOutage.metrics.totalBlocksSampled}
                        </td>
                        <td className="p-2 text-right">
                          {analysisData.periods.postOutage.metrics.totalBlocksSampled}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Metadata & Cache Stats */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <div className="text-muted-foreground">Total Blocks Analyzed</div>
                      <div className="font-semibold">{analysisData.metadata.totalBlocksAnalyzed}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-muted-foreground">Analysis Time</div>
                      <div className="font-semibold">{(analysisData.metadata.analysisTimeMs / 1000).toFixed(2)}s</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-muted-foreground">Timestamp</div>
                      <div className="font-semibold text-xs">
                        {new Date(analysisData.metadata.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysisData.metadata.cacheStatistics && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Cache Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <div className="text-muted-foreground">Cache Hits</div>
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {analysisData.metadata.cacheStatistics.totalCacheHits}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-muted-foreground">Cache Misses (RPC Calls)</div>
                        <div className="font-semibold text-orange-600 dark:text-orange-400">
                          {analysisData.metadata.cacheStatistics.totalCacheMisses}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-muted-foreground">Cache Hit Rate</div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {analysisData.metadata.cacheStatistics.cacheHitRate}
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                        💡 Higher cache hit rate = faster analysis
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {analysisData.metadata.note && (
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> {analysisData.metadata.note}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
