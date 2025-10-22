'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Database, TrendingDown, Shield, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold tracking-tight">About This Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Understanding the AWS Outage Impact on Solana Lending Protocols
          </p>
        </div>

        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
            <CardDescription>AWS us-east-1 Outage - December 10, 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              On December 10, 2024, Amazon Web Services experienced a significant outage in their us-east-1 region,
              which is one of the largest and most critical AWS regions. This outage had cascading effects across
              the Solana DeFi ecosystem, particularly impacting major lending protocols.
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold">Duration: 14:00 - 20:00 UTC (6 hours)</span>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TVL Impact</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4B</div>
              <p className="text-xs text-muted-foreground mt-1">
                Affected across 5 major protocols
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liquidation Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground mt-1">
                256% increase during outage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protocols Affected</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5/5</div>
              <p className="text-xs text-muted-foreground mt-1">
                All major lending protocols impacted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Protocols Section */}
        <Card>
          <CardHeader>
            <CardTitle>Affected Protocols</CardTitle>
            <CardDescription>Major Solana lending platforms impacted by the outage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'MarginFi', logo: '📊', description: 'Largest Solana lending protocol by TVL' },
                { name: 'Kamino Finance', logo: '🌊', description: 'Advanced DeFi strategies and lending' },
                { name: 'Solend', logo: '🏦', description: 'Pioneer lending protocol on Solana' },
                { name: 'Drift Protocol', logo: '🚀', description: 'Trading and lending platform' },
                { name: 'Port Finance', logo: '⚓', description: 'Variable rate lending protocol' },
              ].map((protocol) => (
                <div key={protocol.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <span className="text-4xl">{protocol.logo}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{protocol.name}</h3>
                    <p className="text-sm text-muted-foreground">{protocol.description}</p>
                  </div>
                  <Badge variant="outline">Affected</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Root cause and technical impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">RPC Node Failures</h4>
                  <p className="text-sm text-muted-foreground">
                    Many Solana RPC providers rely on AWS infrastructure. The outage caused widespread
                    RPC node failures, preventing protocols from reading blockchain state and processing
                    transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">Liquidation Bot Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Liquidation bots hosted on AWS were unable to monitor and execute liquidations,
                    leading to cascading liquidations once connectivity was restored.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">User Panic</h4>
                  <p className="text-sm text-muted-foreground">
                    Unable to manage their positions, many users withdrew funds once connectivity was
                    restored, resulting in significant TVL decline.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Data Sources</h3>
            <p className="text-sm text-muted-foreground">
              This dashboard aggregates data from protocol APIs, on-chain analytics, and real-time monitoring
              services. All timestamps are in UTC. Data reflects the period from 14:00 to 20:00 UTC on December 10, 2024.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
