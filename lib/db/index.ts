// Database connection and query utilities
// Using better-sqlite3 for local development (you can switch to PostgreSQL for production)

import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database for local development
const dbPath = path.join(process.cwd(), 'solana-blocks.db');
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better performance

    // Create tables if they don't exist
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(database: Database.Database) {
  // Create solana_blocks table
  database.exec(`
    CREATE TABLE IF NOT EXISTS solana_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_slot INTEGER NOT NULL UNIQUE,
      block_height INTEGER,
      block_time INTEGER,
      parent_slot INTEGER,
      transaction_count INTEGER NOT NULL,
      blockhash TEXT NOT NULL,
      previous_blockhash TEXT NOT NULL,
      rewards TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_solana_blocks_slot ON solana_blocks(block_slot);
    CREATE INDEX IF NOT EXISTS idx_solana_blocks_time ON solana_blocks(block_time);
  `);

  // Create API request logs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS api_request_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      block_slot INTEGER,
      cache_hit INTEGER,
      response_time_ms INTEGER,
      status_code INTEGER,
      error_message TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_request_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_api_logs_block_slot ON api_request_logs(block_slot);
  `);

  // Create program transactions cache table
  database.exec(`
    CREATE TABLE IF NOT EXISTS program_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_slot INTEGER NOT NULL,
      program_id TEXT NOT NULL,
      transaction_count INTEGER NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      UNIQUE(block_slot, program_id)
    );
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_program_tx_slot_program ON program_transactions(block_slot, program_id);
    CREATE INDEX IF NOT EXISTS idx_program_tx_program ON program_transactions(program_id);
  `);
}

// Database operations for block data
export interface BlockData {
  id?: number;
  block_slot: number;
  block_height?: number;
  block_time?: number;
  parent_slot?: number;
  transaction_count: number;
  blockhash: string;
  previous_blockhash: string;
  rewards?: string;
  created_at?: number;
  updated_at?: number;
}

export interface ApiRequestLog {
  endpoint: string;
  method: string;
  block_slot?: number;
  cache_hit: boolean;
  response_time_ms: number;
  status_code: number;
  error_message?: string;
}

export interface ProgramTransactionData {
  id?: number;
  block_slot: number;
  program_id: string;
  transaction_count: number;
  created_at?: number;
}

// Get block by slot number
export function getBlockBySlot(slot: number): BlockData | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM solana_blocks WHERE block_slot = ?');
  return stmt.get(slot) as BlockData | null;
}

// Get block by block height
export function getBlockByHeight(height: number): BlockData | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM solana_blocks WHERE block_height = ?');
  return stmt.get(height) as BlockData | null;
}

// Get blocks in a height range
export function getBlocksByHeightRange(startHeight: number, endHeight: number): BlockData[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM solana_blocks
    WHERE block_height >= ? AND block_height <= ?
    ORDER BY block_height ASC
  `);
  return stmt.all(startHeight, endHeight) as BlockData[];
}

// Insert new block data
export function insertBlock(blockData: BlockData): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO solana_blocks (
      block_slot, block_height, block_time, parent_slot,
      transaction_count, blockhash, previous_blockhash, rewards
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    blockData.block_slot,
    blockData.block_height,
    blockData.block_time,
    blockData.parent_slot,
    blockData.transaction_count,
    blockData.blockhash,
    blockData.previous_blockhash,
    blockData.rewards
  );
}

// Update existing block data
export function updateBlock(slot: number, blockData: Partial<BlockData>): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE solana_blocks
    SET transaction_count = ?,
        blockhash = ?,
        previous_blockhash = ?,
        updated_at = strftime('%s', 'now')
    WHERE block_slot = ?
  `);

  stmt.run(
    blockData.transaction_count,
    blockData.blockhash,
    blockData.previous_blockhash,
    slot
  );
}

// Upsert block data (insert or update)
export function upsertBlock(blockData: BlockData): { cacheHit: boolean } {
  const existing = getBlockBySlot(blockData.block_slot);

  if (existing) {
    // Block already exists in cache
    return { cacheHit: true };
  }

  // Insert new block data
  insertBlock(blockData);
  return { cacheHit: false };
}

// Log API request
export function logApiRequest(log: ApiRequestLog): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO api_request_logs (
      endpoint, method, block_slot, cache_hit,
      response_time_ms, status_code, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    log.endpoint,
    log.method,
    log.block_slot,
    log.cache_hit ? 1 : 0,
    log.response_time_ms,
    log.status_code,
    log.error_message
  );
}

// Get recent blocks
export function getRecentBlocks(limit: number = 10): BlockData[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM solana_blocks
    ORDER BY block_slot DESC
    LIMIT ?
  `);
  return stmt.all(limit) as BlockData[];
}

// Get cache statistics
export function getCacheStats() {
  const db = getDatabase();

  const totalBlocks = db.prepare('SELECT COUNT(*) as count FROM solana_blocks').get() as { count: number };
  const recentLogs = db.prepare(`
    SELECT
      COUNT(*) as total_requests,
      SUM(CASE WHEN cache_hit = 1 THEN 1 ELSE 0 END) as cache_hits,
      AVG(response_time_ms) as avg_response_time
    FROM api_request_logs
    WHERE created_at > strftime('%s', 'now', '-1 hour')
  `).get() as { total_requests: number; cache_hits: number; avg_response_time: number };

  return {
    total_cached_blocks: totalBlocks.count,
    last_hour: {
      total_requests: recentLogs.total_requests || 0,
      cache_hits: recentLogs.cache_hits || 0,
      cache_hit_rate: recentLogs.total_requests > 0
        ? ((recentLogs.cache_hits / recentLogs.total_requests) * 100).toFixed(2)
        : '0.00',
      avg_response_time_ms: Math.round(recentLogs.avg_response_time || 0),
    },
  };
}

// Program transaction cache operations
export function getProgramTransactionCount(slot: number, programId: string): number | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT transaction_count FROM program_transactions WHERE block_slot = ? AND program_id = ?');
  const result = stmt.get(slot, programId) as { transaction_count: number } | undefined;
  return result ? result.transaction_count : null;
}

export function upsertProgramTransactionCount(slot: number, programId: string, count: number): { cacheHit: boolean } {
  const existing = getProgramTransactionCount(slot, programId);

  if (existing !== null) {
    // Already cached
    return { cacheHit: true };
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO program_transactions (block_slot, program_id, transaction_count)
    VALUES (?, ?, ?)
    ON CONFLICT(block_slot, program_id) DO UPDATE SET transaction_count = excluded.transaction_count
  `);

  stmt.run(slot, programId, count);
  return { cacheHit: false };
}

export function getProgramTransactionsByRange(
  startSlot: number,
  endSlot: number,
  programId: string
): ProgramTransactionData[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM program_transactions
    WHERE block_slot >= ? AND block_slot <= ? AND program_id = ?
    ORDER BY block_slot ASC
  `);
  return stmt.all(startSlot, endSlot, programId) as ProgramTransactionData[];
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
