# Solana Block Data API

RESTful API for fetching Solana block data with database caching.

## Features

- ✅ Fetch block data from Solana RPC API
- ✅ Automatic database caching (SQLite for local dev)
- ✅ Cache hit/miss tracking
- ✅ API performance metrics
- ✅ Request logging
- ✅ Error handling and validation

## API Endpoints

### 1. Get Block by Slot

Fetch block data for a specific slot number. Returns cached data if available, otherwise fetches from Solana RPC and caches the result.

**Endpoint:** `GET /api/blocks/[slot]`

**Parameters:**
- `slot` (path parameter) - Block slot number (integer)

**Response:**
```json
{
  "slot": 245123456,
  "blockHeight": 234567890,
  "blockTime": 1702396800,
  "blockhash": "8Yw4Bx...",
  "previousBlockhash": "7Xv3Av...",
  "parentSlot": 245123455,
  "transactionCount": 2847,
  "rewards": [...],
  "cached": true,
  "cachedAt": 1702396850
}
```

**Example:**
```bash
curl http://localhost:3000/api/blocks/245123456
```

---

### 2. List Recent Blocks

Get a list of recently cached blocks with cache statistics.

**Endpoint:** `GET /api/blocks`

**Query Parameters:**
- `limit` (optional) - Number of blocks to return (default: 10, max: 100)

**Response:**
```json
{
  "stats": {
    "total_cached_blocks": 150,
    "last_hour": {
      "total_requests": 45,
      "cache_hits": 38,
      "cache_hit_rate": "84.44",
      "avg_response_time_ms": 125
    }
  },
  "recentBlocks": [
    {
      "slot": 245123456,
      "blockHeight": 234567890,
      "blockTime": 1702396800,
      "transactionCount": 2847,
      "blockhash": "8Yw4Bx...",
      "cachedAt": 1702396850
    }
  ],
  "count": 10
}
```

**Example:**
```bash
curl http://localhost:3000/api/blocks?limit=20
```

---

### 3. Get Current Slot

Fetch the current slot number, optionally with block data.

**Endpoint:** `GET /api/blocks/current`

**Query Parameters:**
- `fetchBlock` (optional) - If `true`, also fetches the current block data (default: false)

**Response (without block data):**
```json
{
  "currentSlot": 245123500,
  "timestamp": 1702396900000
}
```

**Response (with block data):**
```json
{
  "currentSlot": 245123500,
  "slot": 245123500,
  "blockHeight": 234567920,
  "blockTime": 1702396890,
  "blockhash": "9Zx5Cy...",
  "previousBlockhash": "8Yw4Bx...",
  "transactionCount": 2912,
  "cached": false,
  "fetchedAt": 1702396900000
}
```

**Examples:**
```bash
# Just get current slot
curl http://localhost:3000/api/blocks/current

# Get current slot with block data
curl http://localhost:3000/api/blocks/current?fetchBlock=true
```

---

### 4. Get Cache Statistics

Fetch cache performance metrics and API statistics.

**Endpoint:** `GET /api/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalCachedBlocks": 150,
    "lastHour": {
      "totalRequests": 45,
      "cacheHits": 38,
      "cacheMisses": 7,
      "cacheHitRate": "84.44%",
      "avgResponseTimeMs": 125
    }
  },
  "timestamp": 1702396900000
}
```

**Example:**
```bash
curl http://localhost:3000/api/stats
```

---

## Database Schema

### solana_blocks Table

Stores cached block data.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| block_slot | INTEGER | Block slot number (unique) |
| block_height | INTEGER | Block height |
| block_time | INTEGER | Block timestamp (Unix) |
| parent_slot | INTEGER | Parent slot number |
| transaction_count | INTEGER | Number of transactions in block |
| blockhash | TEXT | Block hash |
| previous_blockhash | TEXT | Previous block hash |
| rewards | TEXT | JSON string of rewards data |
| created_at | INTEGER | Cache timestamp |
| updated_at | INTEGER | Last update timestamp |

### api_request_logs Table

Logs all API requests for analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| endpoint | TEXT | API endpoint path |
| method | TEXT | HTTP method |
| block_slot | INTEGER | Block slot (if applicable) |
| cache_hit | INTEGER | Whether cache was hit (0/1) |
| response_time_ms | INTEGER | Response time in milliseconds |
| status_code | INTEGER | HTTP status code |
| error_message | TEXT | Error message (if any) |
| created_at | INTEGER | Request timestamp |

---

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Solana RPC URL (optional, defaults to public mainnet)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Or use a private RPC provider for better performance:
# SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
# SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Database

The API uses SQLite for local development. The database file is created automatically at:
```
/project-root/solana-blocks.db
```

For production, you can modify `/lib/db/index.ts` to use PostgreSQL or another database.

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "slot": 245123456
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Invalid request parameters
- `404` - Block not found
- `500` - Server or RPC error

---

## Performance Considerations

### Caching Strategy

1. **Cache Hit**: If block data exists in the database, it's returned immediately (~10-50ms)
2. **Cache Miss**: Data is fetched from Solana RPC (~200-1000ms) and cached for future requests

### Rate Limiting

Consider implementing rate limiting for production:
- Per IP address limits
- API key authentication
- Request throttling during high load

### RPC Provider

For production use, consider:
- **Helius** (https://helius.dev) - Dedicated Solana RPC with high rate limits
- **Alchemy** (https://www.alchemy.com) - Enterprise RPC with analytics
- **QuickNode** (https://www.quicknode.com) - Fast, reliable RPC nodes
- **Triton One** (https://triton.one) - High-performance RPC

---

## Development

### Install Dependencies

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### Run Development Server

```bash
npm run dev
```

### Test API Endpoints

```bash
# Get a specific block
curl http://localhost:3000/api/blocks/250000000

# List recent cached blocks
curl http://localhost:3000/api/blocks?limit=5

# Get current slot
curl http://localhost:3000/api/blocks/current

# Get cache statistics
curl http://localhost:3000/api/stats
```

---

## Production Deployment

### Database Migration

For production, migrate to PostgreSQL:

1. Update `/lib/db/index.ts` to use `pg` instead of `better-sqlite3`
2. Run the schema from `/lib/db/schema.sql`
3. Update environment variables with PostgreSQL connection string

### Security

- Enable CORS restrictions
- Add API key authentication
- Implement rate limiting
- Use HTTPS only
- Validate all inputs
- Monitor for abuse

### Monitoring

- Track cache hit rates
- Monitor RPC response times
- Set up alerts for errors
- Log all API requests

---

## Example Usage in Frontend

```typescript
// Fetch block data
async function getBlockData(slot: number) {
  const response = await fetch(`/api/blocks/${slot}`);
  const data = await response.json();

  if (data.cached) {
    console.log('Data from cache!');
  } else {
    console.log('Fetched from Solana RPC');
  }

  return data;
}

// Get cache statistics
async function getCacheStats() {
  const response = await fetch('/api/stats');
  const data = await response.json();

  console.log(`Cache hit rate: ${data.stats.lastHour.cacheHitRate}`);
  return data;
}
```

---

## License

MIT
