'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { protocolsData, formatCurrency, formatNumber } from '@/lib/data';
import { ArrowDown, ArrowUp, Activity, TrendingDown, TrendingUp, Globe, Users } from 'lucide-react';

export default function ProtocolsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold tracking-tight">Protocol Details</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Comprehensive breakdown of each lending protocol
          </p>
        </div>

        {/* Protocols Grid */}
        <div className="space-y-6">
          {protocolsData.map((protocol) => (
            <Card key={protocol.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{protocol.logo}</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl">{protocol.name}</CardTitle>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(protocol.status)}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(protocol.status)}
                        <Badge variant="outline">Rank #{protocol.id}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* TVL Section */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">Total Value Locked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{formatCurrency(protocol.tvl)}</div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${protocol.tvlChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {protocol.tvlChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                          {protocol.tvlChange < 0 ? '' : '+'}{protocol.tvlChange}% change
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deposits & Borrows */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">Market Activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Deposits</div>
                        <div className="text-lg font-bold">{formatCurrency(protocol.deposits)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Borrows</div>
                        <div className="text-lg font-bold">{formatCurrency(protocol.borrows)}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interest Rates */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">Interest Rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Avg Borrow APR</div>
                        <div className="text-lg font-bold text-orange-500">{protocol.avgBorrowRate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Avg Supply APR</div>
                        <div className="text-lg font-bold text-green-500">{protocol.avgSupplyRate}%</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Liquidations */}
                  <Card className="shadow-sm border-red-200 dark:border-red-900">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs">Liquidation Activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="text-3xl font-bold text-red-500">
                          {formatNumber(protocol.liquidations)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total liquidations</div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        +{protocol.liquidationsChange.toFixed(0)}% spike
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Details */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Protocol Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Launch Date</span>
                        <span className="font-medium">
                          {protocol.id === 1 ? 'Oct 2023' : protocol.id === 2 ? 'Feb 2023' : protocol.id === 3 ? 'Aug 2021' : protocol.id === 4 ? 'Apr 2022' : 'Jul 2021'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Utilization Rate</span>
                        <span className="font-medium">
                          {((protocol.borrows / protocol.deposits) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Markets</span>
                        <span className="font-medium">{protocol.id * 3 + 5} assets</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Outage Impact Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status Duration</span>
                        <span className="font-medium">
                          {protocol.status === 'operational' ? '1.2 hours' : protocol.status === 'degraded' ? '3.5 hours' : '5.8 hours'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recovery Time</span>
                        <span className="font-medium">
                          {protocol.status === 'operational' ? 'Fast' : protocol.status === 'degraded' ? 'Moderate' : 'Slow'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User Impact</span>
                        <span className="font-medium">
                          {protocol.status === 'operational' ? 'Low' : protocol.status === 'degraded' ? 'Medium' : 'High'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
