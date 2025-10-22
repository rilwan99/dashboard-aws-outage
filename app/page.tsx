'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import {
  blockchainMetrics,
  outageTimeline,
  getBlockchainSummary,
  formatNumber,
  formatDuration,
  formatPercentage,
} from '@/lib/blockchain-data';
import { AlertTriangle, Activity, TrendingDown, TrendingUp, Zap, Clock, Users, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const summary = getBlockchainSummary();

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

  const getCategoryBadge = (category: string) => {
    const styles = {
      blockchain: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      protocol: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      infrastructure: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    };
    return <Badge className={styles[category as keyof typeof styles] || ''}>{category}</Badge>;
  };

  // Prepare chart data
  const tpsChartData = blockchainMetrics.map(m => ({ time: m.timestamp, value: m.tps }));
  const confirmationTimeData = blockchainMetrics.map(m => ({ time: m.timestamp, value: m.avgConfirmationTime }));
  const failedTxData = blockchainMetrics.map(m => ({ time: m.timestamp, value: m.failedTransactions }));
  const validatorData = blockchainMetrics.map(m => ({ time: m.timestamp, value: m.activeValidators }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold tracking-tight">Solana Blockchain</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AWS Outage Impact Analysis - December 10, 2024
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average TPS</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.avgTPS)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500">Min: {formatNumber(summary.minTPS)} TPS</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatNumber(summary.totalFailed)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((summary.totalFailed / summary.totalConfirmed) * 100).toFixed(1)}% failure rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confirmation Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgConfirmTime}s</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span className="text-red-500">Peak: 4.5s delay</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validators Affected</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.validatorsDrop}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Dropped offline during outage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Network Performance</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Network Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Per Second (TPS)</CardTitle>
                  <CardDescription>Network throughput during outage period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: 'TPS',
                        color: 'hsl(var(--chart-1))',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tpsChartData}>
                        <defs>
                          <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorTps)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failed Transactions</CardTitle>
                  <CardDescription>Transaction failures per 30-minute interval</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Failed Transactions',
                        color: 'hsl(var(--destructive))',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={failedTxData}>
                        <defs>
                          <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorFailed)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confirmation Time</CardTitle>
                  <CardDescription>Average transaction confirmation time (seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Confirmation Time',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={confirmationTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Validators</CardTitle>
                  <CardDescription>Number of active validators on the network</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: 'Validators',
                        color: 'hsl(var(--chart-3))',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={validatorData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[1750, 1900]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-4">
              {blockchainMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{metric.timestamp} UTC</CardTitle>
                        <CardDescription>Block Height: {formatNumber(metric.blockHeight)}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {metric.tps < 1500 && <Badge variant="destructive">Critical</Badge>}
                        {metric.tps >= 1500 && metric.tps < 2200 && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>}
                        {metric.tps >= 2200 && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">TPS</div>
                        <div className="text-xl font-bold">{formatNumber(metric.tps)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Confirmed Transactions</div>
                        <div className="text-xl font-bold">{formatNumber(metric.confirmedTransactions)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Failed Transactions</div>
                        <div className="text-xl font-bold text-red-500">{formatNumber(metric.failedTransactions)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Avg Confirmation</div>
                        <div className="text-xl font-bold">{formatDuration(metric.avgConfirmationTime)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Active Validators</div>
                        <div className="text-xl font-bold">{formatNumber(metric.activeValidators)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Slot Time</div>
                        <div className="text-xl font-bold">{metric.slotTime}ms</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Network Utilization</div>
                        <div className="text-xl font-bold">{metric.networkUtilization}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                        <div className="text-xl font-bold">
                          {((metric.confirmedTransactions / (metric.confirmedTransactions + metric.failedTransactions)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Outage Timeline</CardTitle>
                <CardDescription>Chronological events during the AWS outage and recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outageTimeline.map((event, index) => (
                    <div key={index} className="flex gap-4 border-l-2 border-muted pl-4 pb-4 last:pb-0">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">
                            {new Date(event.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {getSeverityBadge(event.severity)}
                          {getCategoryBadge(event.category)}
                          {event.affectedMetric && (
                            <Badge variant="outline" className="text-xs">{event.affectedMetric}</Badge>
                          )}
                        </div>
                        <h4 className="font-semibold">{event.event}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Network Impact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Solana experienced a {((1 - summary.minTPS / summary.maxTPS) * 100).toFixed(0)}% drop in TPS during peak outage,
                  with {formatNumber(summary.totalFailed)} transaction failures across the 6-hour period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Performance Degradation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Average confirmation times increased to {summary.avgConfirmTime}s, with peak delays reaching 4.5s
                  compared to normal sub-second confirmations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Recovery
                </h3>
                <p className="text-sm text-muted-foreground">
                  Network fully recovered by 19:45 UTC with all metrics returning to normal ranges.
                  Total outage duration: approximately 5.5 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
