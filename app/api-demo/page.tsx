'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Database, Search, TrendingUp } from 'lucide-react';

export default function ApiDemoPage() {
  const [slotInput, setSlotInput] = useState('');
  const [blockData, setBlockData] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [recentBlocks, setRecentBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockBySlot = async () => {
    if (!slotInput) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/blocks/${slotInput}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch block');
      }

      setBlockData(data);
    } catch (err: any) {
      setError(err.message);
      setBlockData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSlot = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blocks/current?fetchBlock=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch current slot');
      }

      setBlockData(data);
      setSlotInput(data.slot.toString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCacheStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setCacheStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blocks?limit=10');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recent blocks');
      }

      setRecentBlocks(data.recentBlocks);
      setCacheStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold tracking-tight">Solana Block API Demo</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test the RESTful API endpoints for fetching Solana block data
          </p>
        </div>

        {/* API Controls */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Fetch Block by Slot
              </CardTitle>
              <CardDescription>
                Enter a slot number to fetch block data (cached if available)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter slot number (e.g., 250000000)"
                  value={slotInput}
                  onChange={(e) => setSlotInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && fetchBlockBySlot()}
                />
                <Button onClick={fetchBlockBySlot} disabled={loading || !slotInput}>
                  {loading ? 'Loading...' : 'Fetch'}
                </Button>
              </div>
              <Button onClick={fetchCurrentSlot} disabled={loading} variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                Fetch Current Slot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache & Statistics
              </CardTitle>
              <CardDescription>
                View cached blocks and API performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={fetchRecentBlocks} disabled={loading} variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                View Recent Cached Blocks
              </Button>
              <Button onClick={fetchCacheStats} disabled={loading} variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Fetch Cache Statistics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Block Data Display */}
        {blockData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Block Data</CardTitle>
                {blockData.cached !== undefined && (
                  <Badge variant={blockData.cached ? 'default' : 'secondary'}>
                    {blockData.cached ? '✓ From Cache' : '⚡ Fresh from RPC'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Slot</div>
                  <div className="text-lg font-bold font-mono">{blockData.slot}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Block Height</div>
                  <div className="text-lg font-bold font-mono">{blockData.blockHeight || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Transaction Count</div>
                  <div className="text-lg font-bold text-blue-600">{blockData.transactionCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Block Time</div>
                  <div className="text-lg font-bold">
                    {blockData.blockTime
                      ? new Date(blockData.blockTime * 1000).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">Blockhash</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded break-all">
                    {blockData.blockhash}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">Previous Blockhash</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded break-all">
                    {blockData.previousBlockhash}
                  </div>
                </div>
                {blockData.parentSlot && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Parent Slot</div>
                    <div className="text-lg font-bold font-mono">{blockData.parentSlot}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cache Statistics */}
        {cacheStats && (
          <Card>
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
              <CardDescription>Performance metrics from the last hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Cached Blocks</div>
                  <div className="text-2xl font-bold">{cacheStats.totalCachedBlocks || cacheStats.total_cached_blocks}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Requests (1h)</div>
                  <div className="text-2xl font-bold">
                    {cacheStats.lastHour?.totalRequests || cacheStats.last_hour?.total_requests || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Cache Hit Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {cacheStats.lastHour?.cacheHitRate || cacheStats.last_hour?.cache_hit_rate || '0'}
                    {typeof cacheStats.lastHour?.cacheHitRate === 'number' ? '%' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold">
                    {cacheStats.lastHour?.avgResponseTimeMs || cacheStats.last_hour?.avg_response_time_ms || 0}ms
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Blocks */}
        {recentBlocks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Cached Blocks</CardTitle>
              <CardDescription>Last {recentBlocks.length} blocks in cache</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentBlocks.map((block) => (
                  <div
                    key={block.slot}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSlotInput(block.slot.toString());
                      fetchBlockBySlot();
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-mono font-semibold">Slot: {block.slot}</div>
                      <div className="text-sm text-muted-foreground">
                        {block.transactionCount} transactions
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {block.blockTime
                        ? new Date(block.blockTime * 1000).toLocaleString()
                        : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Documentation Link */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">API Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For complete API documentation, see the README in the <code className="bg-muted px-1 py-0.5 rounded">/app/api</code> directory.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/blocks/[slot]</code>
                <span className="ml-2 text-muted-foreground">- Fetch block by slot number</span>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/blocks</code>
                <span className="ml-2 text-muted-foreground">- List recent cached blocks</span>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/blocks/current</code>
                <span className="ml-2 text-muted-foreground">- Get current slot</span>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/stats</code>
                <span className="ml-2 text-muted-foreground">- Get cache statistics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
