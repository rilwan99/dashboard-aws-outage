export interface ProtocolMetrics {
  id: string;
  name: string;
  logo: string;
  tvl: number;
  tvlChange: number;
  deposits: number;
  depositsChange: number;
  borrows: number;
  borrowsChange: number;
  liquidations: number;
  liquidationsChange: number;
  status: 'operational' | 'degraded' | 'down';
  avgBorrowRate: number;
  avgSupplyRate: number;
}

export interface TimelineEvent {
  timestamp: string;
  protocol: string;
  event: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  protocol?: string;
}

// Mock data for Solana lending protocols during AWS outage
export const protocolsData: ProtocolMetrics[] = [
  {
    id: 'marginfi',
    name: 'MarginFi',
    logo: '🏦',
    tvl: 847500000,
    tvlChange: -12.3,
    deposits: 892000000,
    depositsChange: -8.7,
    borrows: 445000000,
    borrowsChange: -15.2,
    liquidations: 3420,
    liquidationsChange: 245.6,
    status: 'degraded',
    avgBorrowRate: 8.4,
    avgSupplyRate: 3.2,
  },
  {
    id: 'kamino',
    name: 'Kamino',
    logo: '⚡',
    tvl: 623000000,
    tvlChange: -9.8,
    deposits: 654000000,
    depositsChange: -6.3,
    borrows: 312000000,
    borrowsChange: -11.4,
    liquidations: 2156,
    liquidationsChange: 189.3,
    status: 'degraded',
    avgBorrowRate: 7.2,
    avgSupplyRate: 2.8,
  },
  {
    id: 'solend',
    name: 'Solend',
    logo: '🌊',
    tvl: 445000000,
    tvlChange: -14.5,
    deposits: 478000000,
    depositsChange: -10.2,
    borrows: 234000000,
    borrowsChange: -18.7,
    liquidations: 1892,
    liquidationsChange: 312.4,
    status: 'down',
    avgBorrowRate: 9.1,
    avgSupplyRate: 3.5,
  },
  {
    id: 'drift',
    name: 'Drift Protocol',
    logo: '🎯',
    tvl: 289000000,
    tvlChange: -7.2,
    deposits: 312000000,
    depositsChange: -5.1,
    borrows: 156000000,
    borrowsChange: -9.3,
    liquidations: 1234,
    liquidationsChange: 156.8,
    status: 'operational',
    avgBorrowRate: 6.8,
    avgSupplyRate: 2.4,
  },
  {
    id: 'port',
    name: 'Port Finance',
    logo: '🔷',
    tvl: 156000000,
    tvlChange: -16.3,
    deposits: 167000000,
    depositsChange: -12.8,
    borrows: 89000000,
    borrowsChange: -21.5,
    liquidations: 978,
    liquidationsChange: 423.1,
    status: 'down',
    avgBorrowRate: 10.2,
    avgSupplyRate: 4.1,
  },
];

export const outageTimeline: TimelineEvent[] = [
  {
    timestamp: '2024-12-10T14:23:00Z',
    protocol: 'AWS',
    event: 'Initial Outage Detected',
    severity: 'critical',
    description: 'AWS us-east-1 region experiences degraded performance affecting RPC nodes',
  },
  {
    timestamp: '2024-12-10T14:45:00Z',
    protocol: 'Solend',
    event: 'Service Disruption',
    severity: 'critical',
    description: 'Platform unable to process transactions, oracle price feeds delayed',
  },
  {
    timestamp: '2024-12-10T15:02:00Z',
    protocol: 'MarginFi',
    event: 'Degraded Performance',
    severity: 'high',
    description: 'Slow transaction processing, users experiencing timeout errors',
  },
  {
    timestamp: '2024-12-10T15:15:00Z',
    protocol: 'Port Finance',
    event: 'Complete Outage',
    severity: 'critical',
    description: 'Platform offline, unable to access positions or execute transactions',
  },
  {
    timestamp: '2024-12-10T15:28:00Z',
    protocol: 'Kamino',
    event: 'Partial Service Loss',
    severity: 'high',
    description: 'Lending markets operational but liquidation engine delayed',
  },
  {
    timestamp: '2024-12-10T15:42:00Z',
    protocol: 'Multiple',
    event: 'Liquidation Cascade Begins',
    severity: 'critical',
    description: 'Delayed oracle updates trigger mass liquidations across protocols',
  },
  {
    timestamp: '2024-12-10T16:30:00Z',
    protocol: 'AWS',
    event: 'Partial Recovery',
    severity: 'medium',
    description: 'AWS services begin recovery, some RPC nodes coming back online',
  },
  {
    timestamp: '2024-12-10T17:15:00Z',
    protocol: 'Drift Protocol',
    event: 'Full Recovery',
    severity: 'low',
    description: 'Platform fully operational, all services restored',
  },
  {
    timestamp: '2024-12-10T18:20:00Z',
    protocol: 'MarginFi',
    event: 'Services Restored',
    severity: 'low',
    description: 'Transaction processing normalized, oracle feeds stable',
  },
  {
    timestamp: '2024-12-10T19:45:00Z',
    protocol: 'AWS',
    event: 'Full Resolution',
    severity: 'low',
    description: 'AWS confirms all services restored to normal operation',
  },
];

// TVL data over time during outage
export const tvlChartData: ChartDataPoint[] = [
  { time: '14:00', value: 2360 },
  { time: '14:30', value: 2298 },
  { time: '15:00', value: 2156 },
  { time: '15:30', value: 2012 },
  { time: '16:00', value: 1945 },
  { time: '16:30', value: 1998 },
  { time: '17:00', value: 2087 },
  { time: '17:30', value: 2134 },
  { time: '18:00', value: 2189 },
  { time: '18:30', value: 2223 },
  { time: '19:00', value: 2267 },
  { time: '19:30', value: 2298 },
];

// Liquidations over time
export const liquidationsChartData: ChartDataPoint[] = [
  { time: '14:00', value: 12 },
  { time: '14:30', value: 34 },
  { time: '15:00', value: 89 },
  { time: '15:30', value: 245 },
  { time: '16:00', value: 412 },
  { time: '16:30', value: 367 },
  { time: '17:00', value: 234 },
  { time: '17:30', value: 156 },
  { time: '18:00', value: 98 },
  { time: '18:30', value: 56 },
  { time: '19:00', value: 34 },
  { time: '19:30', value: 23 },
];

// Borrow rates by protocol
export const borrowRatesData: ChartDataPoint[] = [
  { time: '14:00', value: 7.2 },
  { time: '14:30', value: 7.8 },
  { time: '15:00', value: 9.3 },
  { time: '15:30', value: 12.4 },
  { time: '16:00', value: 15.8 },
  { time: '16:30', value: 13.2 },
  { time: '17:00', value: 10.5 },
  { time: '17:30', value: 9.1 },
  { time: '18:00', value: 8.4 },
  { time: '18:30', value: 7.9 },
  { time: '19:00', value: 7.5 },
  { time: '19:30', value: 7.3 },
];

// Utility function to format currency
export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

// Utility function to format numbers
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// Calculate total metrics
export function getTotalMetrics() {
  const totalTVL = protocolsData.reduce((sum, p) => sum + p.tvl, 0);
  const totalDeposits = protocolsData.reduce((sum, p) => sum + p.deposits, 0);
  const totalBorrows = protocolsData.reduce((sum, p) => sum + p.borrows, 0);
  const totalLiquidations = protocolsData.reduce((sum, p) => sum + p.liquidations, 0);

  return {
    totalTVL,
    totalDeposits,
    totalBorrows,
    totalLiquidations,
    avgTVLChange: protocolsData.reduce((sum, p) => sum + p.tvlChange, 0) / protocolsData.length,
    protocolsAffected: protocolsData.filter(p => p.status !== 'operational').length,
  };
}
