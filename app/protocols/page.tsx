'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { protocolMetrics, getProtocolSummary, formatNumber, formatPercentage, formatDuration } from '@/lib/blockchain-data';
import { TrendingDown, TrendingUp, AlertCircle, Users, Zap, XCircle, CheckCircle2 } from 'lucide-react';

export default function ProtocolsPage() {
  const summary = getProtocolSummary();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Down</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return <Badge variant="destructive">Critical Impact</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High Impact</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Impact</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low Impact</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      'DeFi': 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      'NFT': 'bg-pink-100 text-pink-800 hover:bg-pink-100',
      'Gaming': 'bg-green-100 text-green-800 hover:bg-green-100',
      'Infrastructure': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    };
    return <Badge className={styles[category as keyof typeof styles] || ''}>{category}</Badge>;
  };

  // Group protocols by category
  const protocolsByCategory = protocolMetrics.reduce((acc, protocol) => {
    if (!acc[protocol.category]) {
      acc[protocol.category] = [];
    }
    acc[protocol.category].push(protocol);
    return acc;
  }, {} as Record<string, typeof protocolMetrics>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold tracking-tight">Protocol Transaction Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Transaction patterns and network degradation across Solana protocols
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalTransactions)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {protocolMetrics.length} protocols
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatNumber(summary.totalFailed)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.failureRate}% failure rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgSuccessRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                During outage period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalUsers)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique users affected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Protocols</TabsTrigger>
            <TabsTrigger value="DeFi">DeFi</TabsTrigger>
            <TabsTrigger value="NFT">NFT</TabsTrigger>
            <TabsTrigger value="Gaming">Gaming</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* All Protocols Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {protocolMetrics.map((protocol) => (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{protocol.logo}</span>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-2xl">{protocol.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(protocol.status)}
                            {getCategoryBadge(protocol.category)}
                            {getImpactBadge(protocol.estimatedImpact)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {/* Transaction Volume */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-xs">Transaction Volume</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <div className="text-2xl font-bold">{formatNumber(protocol.totalTransactions)}</div>
                            <div className={`text-sm font-semibold flex items-center gap-1 mt-1 ${protocol.transactionsChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {protocol.transactionsChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                              {protocol.transactionsChange < 0 ? '' : '+'}{protocol.transactionsChange}% vs normal
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Transaction Success */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-xs">Transaction Performance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                            <div className={`text-lg font-bold ${protocol.successRate >= 85 ? 'text-green-500' : protocol.successRate >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {formatPercentage(protocol.successRate)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Failed Transactions</div>
                            <div className="text-lg font-bold text-red-500">{formatNumber(protocol.failedTransactions)}</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* User Activity */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-xs">User Activity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Unique Users</div>
                            <div className="text-lg font-bold">{formatNumber(protocol.uniqueUsers)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">User Change</div>
                            <div className={`text-lg font-bold ${protocol.usersChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {protocol.usersChange < 0 ? '' : '+'}{protocol.usersChange}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Metrics */}
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-xs">Performance Metrics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Avg Transaction Time</div>
                            <div className="text-lg font-bold">{formatDuration(protocol.avgTransactionTime)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Peak TPS</div>
                            <div className="text-lg font-bold">{formatNumber(protocol.peakTPS)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Impact Assessment */}
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Impact Assessment
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Network Degradation:</span>
                          <span className="ml-2 font-medium">
                            {protocol.estimatedImpact === 'critical' ? 'Severe transaction failures and timeouts' :
                             protocol.estimatedImpact === 'high' ? 'Significant performance degradation' :
                             protocol.estimatedImpact === 'medium' ? 'Moderate slowdowns and some failures' :
                             'Minor impact, mostly operational'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">User Experience:</span>
                          <span className="ml-2 font-medium">
                            {protocol.successRate >= 85 ? 'Generally functional with delays' :
                             protocol.successRate >= 75 ? 'Frequent errors and retries needed' :
                             'Severely impaired, many operations failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Category-specific tabs */}
          {Object.entries(protocolsByCategory).map(([category, protocols]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{category} Protocols Overview</CardTitle>
                  <CardDescription>
                    {protocols.length} {category} protocols analyzed during the outage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {protocols.map((protocol) => (
                      <Card key={protocol.id} className="shadow-sm">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{protocol.logo}</span>
                              <div>
                                <CardTitle className="text-lg">{protocol.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(protocol.status)}
                                  {getImpactBadge(protocol.estimatedImpact)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Transactions</div>
                              <div className="font-bold">{formatNumber(protocol.totalTransactions)}</div>
                              <div className={`text-xs ${protocol.transactionsChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {protocol.transactionsChange < 0 ? '' : '+'}{protocol.transactionsChange}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                              <div className="font-bold">{formatPercentage(protocol.successRate)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Failed Txs</div>
                              <div className="font-bold text-red-500">{formatNumber(protocol.failedTransactions)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Users</div>
                              <div className="font-bold">{formatNumber(protocol.uniqueUsers)}</div>
                              <div className={`text-xs ${protocol.usersChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {protocol.usersChange < 0 ? '' : '+'}{protocol.usersChange}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Avg Time</div>
                              <div className="font-bold">{formatDuration(protocol.avgTransactionTime)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Impact by Category</CardTitle>
                  <CardDescription>Transaction performance across protocol categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(protocolsByCategory).map(([category, protocols]) => {
                    const categoryStats = {
                      totalTx: protocols.reduce((sum, p) => sum + p.totalTransactions, 0),
                      avgSuccess: protocols.reduce((sum, p) => sum + p.successRate, 0) / protocols.length,
                      totalFailed: protocols.reduce((sum, p) => sum + p.failedTransactions, 0),
                    };
                    return (
                      <div key={category} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{category}</h4>
                            {getCategoryBadge(category)}
                          </div>
                          <span className="text-sm text-muted-foreground">{protocols.length} protocols</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Total Transactions</div>
                            <div className="font-bold">{formatNumber(categoryStats.totalTx)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Avg Success Rate</div>
                            <div className="font-bold">{formatPercentage(categoryStats.avgSuccess)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Failed Transactions</div>
                            <div className="font-bold text-red-500">{formatNumber(categoryStats.totalFailed)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Affected Protocols</CardTitle>
                  <CardDescription>Protocols with highest impact during outage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...protocolMetrics]
                      .sort((a, b) => {
                        const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                        return impactOrder[a.estimatedImpact as keyof typeof impactOrder] - impactOrder[b.estimatedImpact as keyof typeof impactOrder];
                      })
                      .slice(0, 5)
                      .map((protocol) => (
                        <div key={protocol.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{protocol.logo}</span>
                            <div>
                              <div className="font-semibold">{protocol.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {getImpactBadge(protocol.estimatedImpact)}
                                {getCategoryBadge(protocol.category)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                            <div className={`text-xl font-bold ${protocol.successRate >= 85 ? 'text-green-500' : protocol.successRate >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {formatPercentage(protocol.successRate)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Key Findings</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Gaming protocols</strong> experienced the most severe impact with STEPN showing a 68.7% success rate
                      and 45.3% drop in transaction volume.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>DeFi protocols</strong> showed varied resilience, with MarginFi experiencing critical impact (72.4% success)
                      while Marinade maintained operational status (89.2% success).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>NFT marketplaces</strong> (Magic Eden, Tensor) showed moderate degradation with success rates around 80%,
                      indicating better resilience than gaming or high-frequency DeFi protocols.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
