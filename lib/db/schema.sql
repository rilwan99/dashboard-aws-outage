-- Database schema for Solana block data caching

CREATE TABLE IF NOT EXISTS solana_blocks (
  id SERIAL PRIMARY KEY,
  block_slot BIGINT NOT NULL UNIQUE,
  block_height BIGINT,
  block_time BIGINT,
  parent_slot BIGINT,
  transaction_count INTEGER NOT NULL,
  blockhash TEXT NOT NULL,
  previous_blockhash TEXT NOT NULL,
  rewards JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups by slot
CREATE INDEX IF NOT EXISTS idx_solana_blocks_slot ON solana_blocks(block_slot);

-- Index for queries by block time
CREATE INDEX IF NOT EXISTS idx_solana_blocks_time ON solana_blocks(block_time);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_solana_blocks_updated_at
  BEFORE UPDATE ON solana_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Table for API request logs
CREATE TABLE IF NOT EXISTS api_request_logs (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  block_slot BIGINT,
  cache_hit BOOLEAN,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_request_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_block_slot ON api_request_logs(block_slot);
