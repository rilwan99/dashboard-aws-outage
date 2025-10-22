# Outage Period Analysis - Complete Guide

Comprehensive transaction analysis comparing network performance before, during, and after the AWS outage.

## 🎯 Overview

This feature analyzes real Solana blockchain data to quantify the impact of the AWS outage on October 20, 2025.

### Outage Period Details

- **Date**: October 20, 2025
- **Time**: 6:30 AM - 9:30 AM UTC
- **Duration**: 3 hours
- **Epoch**: 867
- **Start Slot**: 374,563,500
- **End Slot**: 374,591,000
- **Total Slots**: 27,500

---

## 🔍 Analysis Methodology

### Three-Period Comparison

The analysis compares transaction volumes across three equal periods:

1. **Pre-Outage** (3 hours before)
   - Baseline for normal network performance
   - Slots: 374,536,000 - 374,563,500

2. **During Outage** (3 hours)
   - AWS outage period
   - Slots: 374,563,500 - 374,591,000

3. **Post-Outage** (3 hours after)
   - Recovery period
   - Slots: 374,591,000 - 374,618,500

### Sampling Strategy

To balance accuracy and performance:
- **Sample Size**: 100 blocks per period (configurable)
- **Distribution**: Evenly distributed across the slot range
- **Total Blocks Analyzed**: 300 blocks (100 per period)

For a 27,500 slot range with 100 samples, blocks are fetched every ~275 slots.

---

## 📊 Metrics Calculated

### Per Period

1. **Total Blocks Sampled** - Number of blocks successfully fetched
2. **Total Transactions** - Sum of all transactions in sampled blocks
3. **Average Transactions Per Block** - Mean transaction count
4. **Min/Max Transactions** - Range of transaction counts
5. **Estimated Total Transactions** - Projected total for entire period

### Comparative Analysis

1. **Transaction Drop Percentage**
   - Compares during-outage avg vs pre-outage avg
   - Formula: `((during - pre) / pre) * 100`

2. **Estimated Transaction Loss**
   - Total transactions that would have occurred without outage
   - Formula: `pre_total - during_total`

3. **Recovery Rate**
   - Compares post-outage avg vs pre-outage avg
   - Determines if network fully recovered

4. **Disruption Severity**
   - **Critical**: >50% drop in transaction volume
   - **High**: 30-50% drop
   - **Medium**: 10-30% drop
   - **Low**: <10% drop

---

## 🚀 API Endpoint

### `GET /api/outage-analysis`

Analyzes transaction volumes across the three periods.

**Query Parameters:**
- `sampleSize` (optional) - Blocks to sample per period (default: 100, max: 500)

**Example Request:**
```bash
curl http://localhost:3000/api/outage-analysis?sampleSize=150
```

**Response Structure:**
```json
{
  "success": true,
  "outagePeriod": {
    "epoch": 867,
    "startSlot": 374563500,
    "endSlot": 374591000,
    "startTime": "2025-10-20T06:30:00Z",
    "endTime": "2025-10-20T09:30:00Z",
    "durationHours": 3
  },
  "analysis": {
    "disruptionDetected": true,
    "disruptionSeverity": "high",
    "fullyRecovered": true,
    "transactionDropPercentage": "-35.42",
    "estimatedTransactionLoss": 1250000
  },
  "periods": {
    "preOutage": {
      "timeRange": "3 hours before outage",
      "slotRange": { "start": 374536000, "end": 374563500 },
      "metrics": {
        "totalBlocksSampled": 100,
        "totalTransactions": 285000,
        "averageTransactionsPerBlock": 2850,
        "minTransactions": 2100,
        "maxTransactions": 3200,
        "estimatedTotalTransactions": 7837500
      }
    },
    "duringOutage": {
      "timeRange": "During outage (3 hours)",
      "slotRange": { "start": 374563500, "end": 374591000 },
      "metrics": {
        "totalBlocksSampled": 100,
        "totalTransactions": 184000,
        "averageTransactionsPerBlock": 1840,
        "minTransactions": 800,
        "maxTransactions": 2400,
        "estimatedTotalTransactions": 5060000
      },
      "changeFromBaseline": {
        "avgTransactionsPerBlock": "-35.42%",
        "totalTransactions": "-35.42%"
      }
    },
    "postOutage": {
      "timeRange": "3 hours after outage",
      "slotRange": { "start": 374591000, "end": 374618500 },
      "metrics": {
        "totalBlocksSampled": 100,
        "totalTransactions": 278000,
        "averageTransactionsPerBlock": 2780,
        "minTransactions": 2000,
        "maxTransactions": 3100,
        "estimatedTotalTransactions": 7645000
      },
      "recoveryRate": "-2.46%"
    }
  },
  "comparison": {
    "preVsDuring": {
      "avgTransactionsPerBlock": {
        "pre": "2850.00",
        "during": "1840.00",
        "change": "-35.42%"
      },
      "totalTransactions": {
        "pre": 7837500,
        "during": 5060000,
        "change": "-35.42%"
      }
    },
    "duringVsPost": {
      "avgTransactionsPerBlock": {
        "during": "1840.00",
        "post": "2780.00",
        "change": "+51.09%"
      }
    },
    "preVsPost": {
      "avgTransactionsPerBlock": {
        "pre": "2850.00",
        "post": "2780.00",
        "change": "-2.46%"
      },
      "recovered": true
    }
  },
  "metadata": {
    "sampleSize": 100,
    "totalBlocksAnalyzed": 300,
    "analysisTimeMs": 45230,
    "timestamp": 1729425600000
  }
}
```

---

## 🖥️ Visualization Page

### `http://localhost:3000/outage-analysis`

Interactive page to run and visualize the analysis.

### Features

1. **Outage Period Info**
   - Displays date, time, duration, epoch, and slot range

2. **Run Analysis**
   - Configurable sample size (10-500 blocks)
   - Real-time progress indicator
   - Error handling and display

3. **Summary Cards**
   - Disruption detected (Yes/No with severity)
   - Transaction drop percentage
   - Estimated transaction loss
   - Recovery status

4. **Period Comparison Cards**
   - Side-by-side comparison of all three periods
   - Color-coded severity indicators
   - Percentage changes highlighted

5. **Detailed Comparison Table**
   - All metrics in tabular format
   - Easy to read and compare

6. **Metadata**
   - Total blocks analyzed
   - Analysis execution time
   - Timestamp

---

## 📈 Interpretation Guide

### Disruption Detection

**Criteria**: Transaction drop >10% from baseline

Example interpretations:
- `-5%`: No significant disruption (normal variance)
- `-15%`: **Medium disruption** - noticeable impact
- `-35%`: **High disruption** - significant degradation
- `-60%`: **Critical disruption** - severe outage

### Recovery Analysis

**Criteria**: Post-outage within ±5% of pre-outage baseline

- **Fully Recovered**: Post-outage avg within 5% of pre-outage
- **Partial Recovery**: Post-outage improved but still <95% of baseline
- **No Recovery**: Post-outage still significantly degraded

---

## 🛠️ Technical Implementation

### Solana RPC Client Extensions

**New methods added to `SolanaRPCClient`**:

1. **`getBlockRange(startSlot, endSlot, sampleSize)`**
   - Fetches multiple blocks across a slot range
   - Samples evenly for large ranges
   - Batch processing (10 blocks at a time)
   - Error handling for missing blocks

2. **`analyzeBlockRange(startSlot, endSlot, sampleSize)`**
   - Analyzes transaction volume for a range
   - Calculates min/max/avg metrics
   - Returns structured analysis data

### API Route Logic

**Located in**: `/app/api/outage-analysis/route.ts`

**Process**:
1. Calculate slot ranges for all three periods
2. Fetch blocks in parallel (Promise.all)
3. Calculate metrics for each period
4. Compare periods and detect disruption
5. Determine recovery status
6. Return comprehensive analysis

### Caching Strategy

- Blocks are cached in SQLite database (existing system)
- Repeated analyses are much faster (cache hits)
- No duplicate RPC calls for same blocks

---

## ⚡ Performance Considerations

### Sample Size Impact

| Sample Size | Blocks Analyzed | Estimated Time | Accuracy |
|-------------|-----------------|----------------|----------|
| 50 | 150 | ~15-25 seconds | Good |
| 100 | 300 | ~30-50 seconds | Better |
| 200 | 600 | ~60-90 seconds | Best |
| 500 | 1500 | ~2-4 minutes | Excellent |

**Recommendation**: Use 100-150 for quick analysis, 200-300 for detailed reports

### Optimization Strategies

1. **Batch Processing**: Fetches 10 blocks simultaneously
2. **Database Caching**: Reuses cached block data
3. **Error Recovery**: Continues if some blocks fail
4. **Parallel Execution**: Fetches all 3 periods simultaneously

---

## 📊 Example Analysis Results

### Scenario: 35% Transaction Drop

```
Pre-Outage:    2,850 avg tx/block → 7,837,500 estimated total
During Outage: 1,840 avg tx/block → 5,060,000 estimated total
Post-Outage:   2,780 avg tx/block → 7,645,000 estimated total

Transaction Drop: -35.42%
Estimated Loss: 2,777,500 transactions
Recovery: 97.54% (Fully Recovered)
```

**Interpretation**:
- **High disruption** during outage period
- Network processed 2.7M fewer transactions than expected
- Full recovery within 3 hours post-outage
- Demonstrates resilience of Solana network

---

## 🔍 Validation

### Verify Results

1. **Check slot math**: Ensure 3-hour periods are equal
2. **Validate sample distribution**: Blocks should be evenly spaced
3. **Compare with known data**: Cross-reference with block explorers
4. **Test with different sample sizes**: Results should be consistent

### Known Limitations

1. **Sampling bias**: Random block failures may skew results
2. **RPC rate limits**: Large sample sizes may hit limits
3. **Network variance**: Normal fluctuations may affect accuracy
4. **Clock skew**: Slot times may vary slightly

---

## 🎯 Use Cases

### Research & Analysis

- Quantify infrastructure dependency risks
- Measure network resilience
- Document outage impacts
- Support incident reports

### Monitoring & Alerting

- Detect anomalous transaction drops
- Trigger alerts for disruptions
- Track recovery progress
- Compare historical outages

### Performance Benchmarking

- Establish baseline performance
- Measure degradation severity
- Validate recovery procedures
- Optimize infrastructure

---

## 🚦 Next Steps

### Enhancements

1. **Real-time Monitoring**: Stream current slot data
2. **Historical Comparison**: Compare multiple outages
3. **Protocol-level Analysis**: Break down by protocol
4. **Automated Alerts**: Notify on disruption detection
5. **Export Reports**: Generate PDF/CSV reports
6. **Grafana Integration**: Visualize time-series data

### Integration

- Add to existing blockchain dashboard
- Link from protocol analysis page
- Create automated daily reports
- Build API webhooks for alerts

---

## 📚 API Documentation

Full API documentation available at:
- `/app/api/README.md` - Complete API reference
- `/API_SETUP.md` - Setup and configuration guide

---

## ✅ Testing

### Test the Analysis

```bash
# Quick test with small sample
curl http://localhost:3000/api/outage-analysis?sampleSize=50

# Detailed analysis
curl http://localhost:3000/api/outage-analysis?sampleSize=200

# Check response time
time curl http://localhost:3000/api/outage-analysis
```

### Expected Results

- Response time: 30-60 seconds (sample size 100)
- Disruption detected: Should be `true`
- Severity: Depends on actual historical data
- Total blocks: 300 (for sample size 100)

---

## 🎉 Summary

The Outage Analysis feature provides:

✅ **Comprehensive Analysis** - Pre/during/post period comparison
✅ **Real Blockchain Data** - Fetches actual Solana ledger data
✅ **Disruption Detection** - Automatic severity classification
✅ **Recovery Tracking** - Measures post-outage recovery
✅ **Visual Dashboard** - Interactive web interface
✅ **RESTful API** - Programmable access
✅ **Performance Optimized** - Caching and batch processing

**Ready to use!** Visit `/outage-analysis` to start analyzing.
