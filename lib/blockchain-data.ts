// Blockchain-level metrics for Solana during AWS outage

export interface BlockchainMetrics {
  timestamp: string;
  blockHeight: number;
  tps: number; // Transactions per second
  confirmedTransactions: number;
  failedTransactions: number;
  avgConfirmationTime: number; // in seconds
  activeValidators: number;
  slotTime: number; // in ms
  networkUtilization: number; // percentage
}

export interface ProtocolTransactionMetrics {
  id: string;
  name: string;
  logo: string;
  category: 'DeFi' | 'NFT' | 'Gaming' | 'Infrastructure';
  totalTransactions: number;
  transactionsChange: number; // percentage
  successRate: number; // percentage
  avgTransactionTime: number; // in seconds
  failedTransactions: number;
  uniqueUsers: number;
  usersChange: number; // percentage
  status: 'operational' | 'degraded' | 'down';
  peakTPS: number;
  estimatedImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface TimelineEvent {
  timestamp: string;
  category: 'blockchain' | 'protocol' | 'infrastructure';
  event: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedMetric?: string;
}

// Blockchain performance data during the outage (14:00-20:00 UTC)
export const blockchainMetrics: BlockchainMetrics[] = [
  { timestamp: '14:00', blockHeight: 245123456, tps: 2847, confirmedTransactions: 512400, failedTransactions: 2340, avgConfirmationTime: 0.4, activeValidators: 1893, slotTime: 420, networkUtilization: 68 },
  { timestamp: '14:30', blockHeight: 245127890, tps: 2654, confirmedTransactions: 477720, failedTransactions: 3890, avgConfirmationTime: 0.5, activeValidators: 1878, slotTime: 450, networkUtilization: 64 },
  { timestamp: '15:00', blockHeight: 245132145, tps: 1923, confirmedTransactions: 346140, failedTransactions: 8234, avgConfirmationTime: 1.2, activeValidators: 1845, slotTime: 580, networkUtilization: 47 },
  { timestamp: '15:30', blockHeight: 245135678, tps: 1234, confirmedTransactions: 222120, failedTransactions: 15678, avgConfirmationTime: 2.8, activeValidators: 1812, slotTime: 750, networkUtilization: 31 },
  { timestamp: '16:00', blockHeight: 245138234, tps: 892, confirmedTransactions: 160560, failedTransactions: 23456, avgConfirmationTime: 4.5, activeValidators: 1789, slotTime: 920, networkUtilization: 22 },
  { timestamp: '16:30', blockHeight: 245141456, tps: 1156, confirmedTransactions: 208080, failedTransactions: 18234, avgConfirmationTime: 3.2, activeValidators: 1823, slotTime: 720, networkUtilization: 29 },
  { timestamp: '17:00', blockHeight: 245145234, tps: 1678, confirmedTransactions: 302040, failedTransactions: 12456, avgConfirmationTime: 1.8, activeValidators: 1856, slotTime: 580, networkUtilization: 41 },
  { timestamp: '17:30', blockHeight: 245149567, tps: 2134, confirmedTransactions: 384120, failedTransactions: 7890, avgConfirmationTime: 0.9, activeValidators: 1872, slotTime: 490, networkUtilization: 53 },
  { timestamp: '18:00', blockHeight: 245154234, tps: 2456, confirmedTransactions: 442080, failedTransactions: 5234, avgConfirmationTime: 0.6, activeValidators: 1885, slotTime: 450, networkUtilization: 61 },
  { timestamp: '18:30', blockHeight: 245158901, tps: 2687, confirmedTransactions: 483660, failedTransactions: 3456, avgConfirmationTime: 0.5, activeValidators: 1890, slotTime: 435, networkUtilization: 65 },
  { timestamp: '19:00', blockHeight: 245163678, tps: 2789, confirmedTransactions: 502020, failedTransactions: 2678, avgConfirmationTime: 0.4, activeValidators: 1892, slotTime: 425, networkUtilization: 67 },
  { timestamp: '19:30', blockHeight: 245168456, tps: 2821, confirmedTransactions: 507780, failedTransactions: 2345, avgConfirmationTime: 0.4, activeValidators: 1893, slotTime: 420, networkUtilization: 68 },
];

// Protocol transaction analysis during outage
export const protocolMetrics: ProtocolTransactionMetrics[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    logo: '🪐',
    category: 'DeFi',
    totalTransactions: 1234567,
    transactionsChange: -23.4,
    successRate: 87.3,
    avgTransactionTime: 1.2,
    failedTransactions: 156789,
    uniqueUsers: 45678,
    usersChange: -18.2,
    status: 'degraded',
    peakTPS: 234,
    estimatedImpact: 'medium',
  },
  {
    id: 'raydium',
    name: 'Raydium',
    logo: '⚡',
    category: 'DeFi',
    totalTransactions: 987654,
    transactionsChange: -34.7,
    successRate: 78.9,
    avgTransactionTime: 1.8,
    failedTransactions: 208345,
    uniqueUsers: 38901,
    usersChange: -28.5,
    status: 'degraded',
    peakTPS: 187,
    estimatedImpact: 'high',
  },
  {
    id: 'marginfi',
    name: 'MarginFi',
    logo: '🏦',
    category: 'DeFi',
    totalTransactions: 456789,
    transactionsChange: -42.1,
    successRate: 72.4,
    avgTransactionTime: 2.4,
    failedTransactions: 126123,
    uniqueUsers: 12345,
    usersChange: -35.6,
    status: 'down',
    peakTPS: 89,
    estimatedImpact: 'high',
  },
  {
    id: 'magiceden',
    name: 'Magic Eden',
    logo: '🎨',
    category: 'NFT',
    totalTransactions: 789012,
    transactionsChange: -28.9,
    successRate: 82.1,
    avgTransactionTime: 1.5,
    failedTransactions: 141234,
    uniqueUsers: 34567,
    usersChange: -22.4,
    status: 'degraded',
    peakTPS: 145,
    estimatedImpact: 'medium',
  },
  {
    id: 'tensor',
    name: 'Tensor',
    logo: '📊',
    category: 'NFT',
    totalTransactions: 345678,
    transactionsChange: -31.2,
    successRate: 79.8,
    avgTransactionTime: 1.7,
    failedTransactions: 69890,
    uniqueUsers: 23456,
    usersChange: -25.3,
    status: 'degraded',
    peakTPS: 67,
    estimatedImpact: 'medium',
  },
  {
    id: 'marinade',
    name: 'Marinade Finance',
    logo: '🌊',
    category: 'DeFi',
    totalTransactions: 234567,
    transactionsChange: -19.4,
    successRate: 89.2,
    avgTransactionTime: 0.9,
    failedTransactions: 25345,
    uniqueUsers: 15678,
    usersChange: -15.2,
    status: 'operational',
    peakTPS: 45,
    estimatedImpact: 'low',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    logo: '🔥',
    category: 'DeFi',
    totalTransactions: 198765,
    transactionsChange: -37.6,
    successRate: 74.3,
    avgTransactionTime: 2.1,
    failedTransactions: 51012,
    uniqueUsers: 9876,
    usersChange: -32.1,
    status: 'degraded',
    peakTPS: 38,
    estimatedImpact: 'high',
  },
  {
    id: 'stepn',
    name: 'STEPN',
    logo: '👟',
    category: 'Gaming',
    totalTransactions: 567890,
    transactionsChange: -45.3,
    successRate: 68.7,
    avgTransactionTime: 2.9,
    failedTransactions: 177678,
    uniqueUsers: 45678,
    usersChange: -41.2,
    status: 'down',
    peakTPS: 112,
    estimatedImpact: 'critical',
  },
];

// Outage timeline with blockchain-level events
export const outageTimeline: TimelineEvent[] = [
  {
    timestamp: '2024-12-10T14:23:00Z',
    category: 'infrastructure',
    event: 'AWS us-east-1 Outage Detected',
    severity: 'critical',
    description: 'AWS us-east-1 region experiences degraded performance affecting Solana RPC infrastructure',
    affectedMetric: 'RPC Availability',
  },
  {
    timestamp: '2024-12-10T14:35:00Z',
    category: 'blockchain',
    event: 'TPS Drop Observed',
    severity: 'high',
    description: 'Solana TPS drops from 2,847 to 2,654 as validators struggle with RPC connectivity',
    affectedMetric: 'Transactions Per Second',
  },
  {
    timestamp: '2024-12-10T14:52:00Z',
    category: 'blockchain',
    event: 'Validator Degradation',
    severity: 'high',
    description: '48 validators drop offline due to AWS dependency, network participation decreases',
    affectedMetric: 'Active Validators',
  },
  {
    timestamp: '2024-12-10T15:08:00Z',
    category: 'blockchain',
    event: 'Critical TPS Decline',
    severity: 'critical',
    description: 'Network TPS falls below 2,000 - lowest point in 6 months. Slot time increases to 580ms',
    affectedMetric: 'Network Performance',
  },
  {
    timestamp: '2024-12-10T15:24:00Z',
    category: 'protocol',
    event: 'DeFi Protocol Failures Begin',
    severity: 'critical',
    description: 'Major DeFi protocols (Jupiter, Raydium, MarginFi) report transaction failures >30%',
    affectedMetric: 'Protocol Availability',
  },
  {
    timestamp: '2024-12-10T15:45:00Z',
    category: 'blockchain',
    event: 'Network Utilization Minimum',
    severity: 'critical',
    description: 'Network utilization drops to 31% - TPS at 1,234. Confirmation times spike to 2.8s',
    affectedMetric: 'Network Capacity',
  },
  {
    timestamp: '2024-12-10T16:00:00Z',
    category: 'blockchain',
    event: 'Peak Outage Impact',
    severity: 'critical',
    description: 'Lowest performance: 892 TPS, 23,456 failed transactions, 4.5s avg confirmation time',
    affectedMetric: 'All Metrics',
  },
  {
    timestamp: '2024-12-10T16:18:00Z',
    category: 'protocol',
    event: 'Gaming & NFT Platforms Severely Impacted',
    severity: 'high',
    description: 'STEPN and NFT marketplaces report 65%+ transaction failure rates',
    affectedMetric: 'User Experience',
  },
  {
    timestamp: '2024-12-10T16:35:00Z',
    category: 'infrastructure',
    event: 'AWS Partial Recovery Begins',
    severity: 'medium',
    description: 'AWS reports partial service restoration in us-east-1. Some RPC nodes reconnecting',
    affectedMetric: 'Infrastructure',
  },
  {
    timestamp: '2024-12-10T17:02:00Z',
    category: 'blockchain',
    event: 'Validator Recovery',
    severity: 'medium',
    description: 'Validators begin reconnecting. Active count rises to 1,856 (+44 from minimum)',
    affectedMetric: 'Network Health',
  },
  {
    timestamp: '2024-12-10T17:28:00Z',
    category: 'blockchain',
    event: 'TPS Recovery to 2,000+',
    severity: 'low',
    description: 'Network TPS exceeds 2,000 for the first time since peak outage',
    affectedMetric: 'Throughput',
  },
  {
    timestamp: '2024-12-10T18:05:00Z',
    category: 'protocol',
    event: 'Protocol Services Recovering',
    severity: 'low',
    description: 'Major protocols report improved success rates >85% as network stabilizes',
    affectedMetric: 'Protocol Performance',
  },
  {
    timestamp: '2024-12-10T18:42:00Z',
    category: 'blockchain',
    event: 'Normal Operations Approaching',
    severity: 'low',
    description: 'Network metrics near pre-outage levels: 2,687 TPS, 0.5s confirmation, 65% utilization',
    affectedMetric: 'Overall Health',
  },
  {
    timestamp: '2024-12-10T19:15:00Z',
    category: 'infrastructure',
    event: 'AWS Full Recovery Confirmed',
    severity: 'low',
    description: 'AWS declares us-east-1 fully operational. All RPC providers reporting normal status',
    affectedMetric: 'Infrastructure',
  },
  {
    timestamp: '2024-12-10T19:45:00Z',
    category: 'blockchain',
    event: 'Network Fully Recovered',
    severity: 'low',
    description: 'All blockchain metrics return to normal ranges. Outage impact resolved',
    affectedMetric: 'Complete Recovery',
  },
];

// Utility functions
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`;
  }
  return `${seconds.toFixed(1)}s`;
}

// Calculate aggregate metrics
export function getBlockchainSummary() {
  const preOutage = blockchainMetrics[0];
  const peakOutage = blockchainMetrics.reduce((min, curr) =>
    curr.tps < min.tps ? curr : min
  );
  const postRecovery = blockchainMetrics[blockchainMetrics.length - 1];

  return {
    avgTPS: Math.round(blockchainMetrics.reduce((sum, m) => sum + m.tps, 0) / blockchainMetrics.length),
    minTPS: peakOutage.tps,
    maxTPS: Math.max(...blockchainMetrics.map(m => m.tps)),
    totalConfirmed: blockchainMetrics.reduce((sum, m) => sum + m.confirmedTransactions, 0),
    totalFailed: blockchainMetrics.reduce((sum, m) => sum + m.failedTransactions, 0),
    avgConfirmTime: (blockchainMetrics.reduce((sum, m) => sum + m.avgConfirmationTime, 0) / blockchainMetrics.length).toFixed(2),
    tpsRecovery: ((postRecovery.tps - preOutage.tps) / preOutage.tps * 100).toFixed(1),
    validatorsDrop: preOutage.activeValidators - peakOutage.activeValidators,
  };
}

export function getProtocolSummary() {
  const totalTransactions = protocolMetrics.reduce((sum, p) => sum + p.totalTransactions, 0);
  const totalFailed = protocolMetrics.reduce((sum, p) => sum + p.failedTransactions, 0);
  const avgSuccessRate = protocolMetrics.reduce((sum, p) => sum + p.successRate, 0) / protocolMetrics.length;
  const criticalProtocols = protocolMetrics.filter(p => p.estimatedImpact === 'critical' || p.status === 'down').length;

  return {
    totalTransactions,
    totalFailed,
    avgSuccessRate: avgSuccessRate.toFixed(1),
    failureRate: ((totalFailed / totalTransactions) * 100).toFixed(1),
    protocolsAffected: protocolMetrics.filter(p => p.status !== 'operational').length,
    criticalProtocols,
    totalUsers: protocolMetrics.reduce((sum, p) => sum + p.uniqueUsers, 0),
  };
}
