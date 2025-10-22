// Solana RPC client for fetching block data

export interface SolanaBlockResponse {
  blockHeight: number | null;
  blockTime: number | null;
  blockhash: string;
  parentSlot: number;
  previousBlockhash: string;
  transactions: Array<{
    transaction: any;
    meta: any;
  }>;
  rewards: Array<{
    pubkey: string;
    lamports: number;
    postBalance: number;
    rewardType: string | null;
    commission: number | null;
  }> | null;
}

export interface BlockInfo {
  slot: number;
  blockHeight: number | null;
  blockTime: number | null;
  blockhash: string;
  parentSlot: number;
  previousBlockhash: string;
  transactionCount: number;
  rewards: Array<any> | null;
}

export class SolanaRPCClient {
  private rpcUrl: string;

  constructor(rpcUrl?: string) {
    // Use provided RPC URL or default to public endpoint
    this.rpcUrl = rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  }

  /**
   * Fetch block data from Solana RPC
   * @param slot - Block slot number
   * @param options - Additional options for the RPC call
   */
  async getBlock(
    slot: number,
    options: {
      encoding?: 'json' | 'jsonParsed' | 'base64' | 'base58';
      transactionDetails?: 'full' | 'signatures' | 'none';
      maxSupportedTransactionVersion?: number;
    } = {}
  ): Promise<SolanaBlockResponse> {
    const {
      encoding = 'json',
      transactionDetails = 'full',
      maxSupportedTransactionVersion = 0,
    } = options;

    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBlock',
      params: [
        slot,
        {
          encoding,
          transactionDetails,
          maxSupportedTransactionVersion,
          rewards: true,
        },
      ],
    };

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message}`);
      }

      if (!data.result) {
        throw new Error(`Block not found for slot ${slot}`);
      }

      return data.result;
    } catch (error) {
      console.error(`Error fetching block ${slot}:`, error);
      throw error;
    }
  }

  /**
   * Get formatted block information including transaction count
   * @param slot - Block slot number
   */
  async getBlockInfo(slot: number): Promise<BlockInfo> {
    const blockData = await this.getBlock(slot, {
      encoding: 'json',
      transactionDetails: 'full',
      maxSupportedTransactionVersion: 0,
    });

    return {
      slot,
      blockHeight: blockData.blockHeight,
      blockTime: blockData.blockTime,
      blockhash: blockData.blockhash,
      parentSlot: blockData.parentSlot,
      previousBlockhash: blockData.previousBlockhash,
      transactionCount: blockData.transactions?.length || 0,
      rewards: blockData.rewards,
    };
  }

  /**
   * Get transaction count for a specific block
   * @param slot - Block slot number
   */
  async getBlockTransactionCount(slot: number): Promise<number> {
    // Optimize by only fetching signatures instead of full transactions
    const blockData = await this.getBlock(slot, {
      encoding: 'json',
      transactionDetails: 'signatures',
      maxSupportedTransactionVersion: 0,
    });

    return blockData.transactions?.length || 0;
  }

  /**
   * Get the current slot
   */
  async getCurrentSlot(): Promise<number> {
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getSlot',
      params: [],
    };

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching current slot:', error);
      throw error;
    }
  }

  /**
   * Get block production information
   */
  async getBlockProduction(range?: { firstSlot: number; lastSlot: number }) {
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBlockProduction',
      params: range ? [{ range }] : [],
    };

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching block production:', error);
      throw error;
    }
  }

  /**
   * Get block by height (converts height to slot first)
   * @param blockHeight - Block height number
   */
  async getBlockByHeight(blockHeight: number): Promise<BlockInfo> {
    // First, try to get the block from cache by height
    const { getBlockByHeight: getCachedBlock } = await import('@/lib/db');
    const cached = getCachedBlock(blockHeight);

    if (cached) {
      return {
        slot: cached.block_slot,
        blockHeight: cached.block_height ?? null,
        blockTime: cached.block_time ?? null,
        blockhash: cached.blockhash,
        parentSlot: cached.parent_slot || 0,
        previousBlockhash: cached.previous_blockhash,
        transactionCount: cached.transaction_count,
        rewards: cached.rewards ? JSON.parse(cached.rewards) : null,
      };
    }

    // Need to fetch from RPC - use getBlocks to find slot for this height
    // For now, we'll use an approximation or direct slot lookup
    // Note: This is a simplified approach - in production, you'd maintain a height->slot mapping
    throw new Error(`Block height ${blockHeight} not in cache. Please provide slot number instead.`);
  }

  /**
   * Get multiple blocks in a range by height
   * @param startHeight - Starting block height
   * @param endHeight - Ending block height
   * @param sampleSize - Number of blocks to sample (for large ranges)
   * @param useCache - Whether to check cache first (default: true)
   */
  async getBlockRangeByHeight(
    startHeight: number,
    endHeight: number,
    sampleSize?: number,
    useCache: boolean = true
  ): Promise<BlockInfo[]> {
    const totalBlocks = endHeight - startHeight;
    const blocks: BlockInfo[] = [];

    // Calculate which heights to fetch
    let heightsToFetch: number[];
    if (sampleSize && totalBlocks > sampleSize) {
      const step = Math.floor(totalBlocks / sampleSize);
      heightsToFetch = Array.from({ length: sampleSize }, (_, i) => startHeight + i * step);
    } else {
      heightsToFetch = Array.from({ length: totalBlocks }, (_, i) => startHeight + i);
    }

    // First, try to get from cache
    if (useCache) {
      const { getBlocksByHeightRange } = await import('@/lib/db');
      const cachedBlocks = getBlocksByHeightRange(startHeight, endHeight);

      if (cachedBlocks.length > 0) {
        console.log(`Found ${cachedBlocks.length} cached blocks for range ${startHeight}-${endHeight}`);

        // Filter to match our sample
        const cachedHeights = new Set(cachedBlocks.map(b => b.block_height));

        const cachedBlockInfos = cachedBlocks
          .filter(b => b.block_height && heightsToFetch.includes(b.block_height))
          .map(b => ({
            slot: b.block_slot,
            blockHeight: b.block_height ?? null,
            blockTime: b.block_time ?? null,
            blockhash: b.blockhash,
            parentSlot: b.parent_slot || 0,
            previousBlockhash: b.previous_blockhash,
            transactionCount: b.transaction_count,
            rewards: b.rewards ? JSON.parse(b.rewards) : null,
          }));

        blocks.push(...cachedBlockInfos);

        // Remove cached heights from fetch list
        heightsToFetch = heightsToFetch.filter(h => !cachedHeights.has(h));
      }
    }

    // For remaining heights, we need slots - this requires a mapping
    // For this implementation, we'll log what's not in cache
    if (heightsToFetch.length > 0) {
      console.log(`${heightsToFetch.length} blocks not in cache, would need to fetch from RPC`);
      console.log(`Missing heights: ${heightsToFetch.slice(0, 5).join(', ')}${heightsToFetch.length > 5 ? '...' : ''}`);
    }

    return blocks;
  }

  /**
   * Get multiple blocks in a range by slot
   * @param startSlot - Starting slot
   * @param endSlot - Ending slot
   * @param sampleSize - Number of blocks to sample (for large ranges)
   * @param useCache - Whether to check cache first (default: true)
   */
  async getBlockRange(
    startSlot: number,
    endSlot: number,
    sampleSize?: number,
    useCache: boolean = true
  ): Promise<BlockInfo[]> {
    const totalBlocks = endSlot - startSlot;
    const blocks: BlockInfo[] = [];

    // Calculate which slots to fetch
    let slotsToFetch: number[];
    if (sampleSize && totalBlocks > sampleSize) {
      const step = Math.floor(totalBlocks / sampleSize);
      slotsToFetch = Array.from({ length: sampleSize }, (_, i) => startSlot + i * step);
    } else {
      slotsToFetch = Array.from({ length: totalBlocks }, (_, i) => startSlot + i);
    }

    // First, try to get from cache
    const uncachedSlots: number[] = [];

    if (useCache) {
      const { getBlockBySlot } = await import('@/lib/db');

      for (const slot of slotsToFetch) {
        const cached = getBlockBySlot(slot);
        if (cached) {
          blocks.push({
            slot: cached.block_slot,
            blockHeight: cached.block_height ?? null,
            blockTime: cached.block_time ?? null,
            blockhash: cached.blockhash,
            parentSlot: cached.parent_slot || 0,
            previousBlockhash: cached.previous_blockhash,
            transactionCount: cached.transaction_count,
            rewards: cached.rewards ? JSON.parse(cached.rewards) : null,
          });
        } else {
          uncachedSlots.push(slot);
        }
      }

      console.log(`Cache: ${blocks.length} hits, ${uncachedSlots.length} misses`);
    } else {
      uncachedSlots.push(...slotsToFetch);
    }

    // Fetch uncached blocks from RPC
    if (uncachedSlots.length > 0) {
      const { upsertBlock } = await import('@/lib/db');
      const batchSize = 10;

      for (let i = 0; i < uncachedSlots.length; i += batchSize) {
        const batch = uncachedSlots.slice(i, i + batchSize);
        const promises = batch.map(async slot => {
          try {
            const blockInfo = await this.getBlockInfo(slot);

            // Cache the block
            upsertBlock({
              block_slot: blockInfo.slot,
              block_height: blockInfo.blockHeight || undefined,
              block_time: blockInfo.blockTime || undefined,
              parent_slot: blockInfo.parentSlot,
              transaction_count: blockInfo.transactionCount,
              blockhash: blockInfo.blockhash,
              previous_blockhash: blockInfo.previousBlockhash,
              rewards: blockInfo.rewards ? JSON.stringify(blockInfo.rewards) : undefined,
            });

            return blockInfo;
          } catch (err: any) {
            console.warn(`Failed to fetch block ${slot}:`, err.message);
            return null;
          }
        });

        const results = await Promise.all(promises);
        blocks.push(...results.filter((b): b is BlockInfo => b !== null));
      }
    }

    // Sort by slot
    return blocks.sort((a, b) => a.slot - b.slot);
  }

  /**
   * Analyze transaction volume for a block range
   * @param startSlot - Starting slot
   * @param endSlot - Ending slot
   * @param sampleSize - Number of blocks to sample
   */
  async analyzeBlockRange(
    startSlot: number,
    endSlot: number,
    sampleSize: number = 100
  ): Promise<{
    startSlot: number;
    endSlot: number;
    totalBlocksSampled: number;
    totalTransactions: number;
    averageTransactionsPerBlock: number;
    minTransactions: number;
    maxTransactions: number;
    blocks: BlockInfo[];
  }> {
    const blocks = await this.getBlockRange(startSlot, endSlot, sampleSize);

    const totalTransactions = blocks.reduce((sum, b) => sum + b.transactionCount, 0);
    const transactionCounts = blocks.map(b => b.transactionCount);

    return {
      startSlot,
      endSlot,
      totalBlocksSampled: blocks.length,
      totalTransactions,
      averageTransactionsPerBlock: blocks.length > 0 ? totalTransactions / blocks.length : 0,
      minTransactions: Math.min(...transactionCounts),
      maxTransactions: Math.max(...transactionCounts),
      blocks,
    };
  }

  /**
   * Get program-specific transaction count for a block
   * @param slot - Block slot number
   * @param programId - Program address to filter by
   * @param useCache - Whether to check cache first (default: true)
   */
  async getProgramTransactionCount(slot: number, programId: string, useCache: boolean = true): Promise<number> {
    // Check cache first
    if (useCache) {
      const { getProgramTransactionCount: getCached } = await import('@/lib/db');
      const cached = getCached(slot, programId);

      if (cached !== null) {
        return cached;
      }
    }

    // Fetch from RPC
    try {
      const blockData = await this.getBlock(slot, {
        encoding: 'jsonParsed',
        transactionDetails: 'full',
        maxSupportedTransactionVersion: 0,
      });

      if (!blockData.transactions) {
        // Cache the result (0 transactions)
        if (useCache) {
          const { upsertProgramTransactionCount } = await import('@/lib/db');
          upsertProgramTransactionCount(slot, programId, 0);
        }
        return 0;
      }

      // Count transactions that involve the specified program
      let count = 0;
      for (const tx of blockData.transactions) {
        const accountKeys = tx.transaction?.message?.accountKeys || [];

        // Check if program is in account keys
        const involvesProgramDirectly = accountKeys.some((key: any) => {
          const pubkey = typeof key === 'string' ? key : key.pubkey;
          return pubkey === programId;
        });

        // Also check in inner instructions for program invocations
        const meta = tx.meta;
        let invokesProgram = false;

        if (meta?.innerInstructions) {
          for (const inner of meta.innerInstructions) {
            for (const instruction of inner.instructions) {
              if (instruction.programId === programId) {
                invokesProgram = true;
                break;
              }
            }
            if (invokesProgram) break;
          }
        }

        // Check top-level instructions
        const instructions = tx.transaction?.message?.instructions || [];
        const hasTopLevelInstruction = instructions.some((ix: any) => {
          return ix.programId === programId;
        });

        if (involvesProgramDirectly || invokesProgram || hasTopLevelInstruction) {
          count++;
        }
      }

      // Cache the result
      if (useCache) {
        const { upsertProgramTransactionCount } = await import('@/lib/db');
        upsertProgramTransactionCount(slot, programId, count);
      }

      return count;
    } catch (error) {
      console.error(`Error fetching program transactions for slot ${slot}:`, error);
      return 0;
    }
  }

  /**
   * Analyze program-specific transaction volume for a block range
   * @param startSlot - Starting slot
   * @param endSlot - Ending slot
   * @param programId - Program address to analyze
   * @param sampleSize - Number of blocks to sample
   * @param useCache - Whether to use cache (default: true)
   */
  async analyzeProgramBlockRange(
    startSlot: number,
    endSlot: number,
    programId: string,
    sampleSize: number = 100,
    useCache: boolean = true
  ): Promise<{
    startSlot: number;
    endSlot: number;
    programId: string;
    totalBlocksSampled: number;
    totalProgramTransactions: number;
    totalNetworkTransactions: number;
    averageProgramTransactionsPerBlock: number;
    averageNetworkTransactionsPerBlock: number;
    programPercentage: number;
    minProgramTransactions: number;
    maxProgramTransactions: number;
    cacheHits: number;
    cacheMisses: number;
  }> {
    const totalBlocks = endSlot - startSlot;
    let slotsToFetch: number[];

    if (sampleSize && totalBlocks > sampleSize) {
      const step = Math.floor(totalBlocks / sampleSize);
      slotsToFetch = Array.from({ length: sampleSize }, (_, i) => startSlot + i * step);
    } else {
      slotsToFetch = Array.from({ length: totalBlocks }, (_, i) => startSlot + i);
    }

    const programTxCounts: number[] = [];
    const networkTxCounts: number[] = [];
    let cacheHits = 0;
    let cacheMisses = 0;

    // Check cache first if enabled
    if (useCache) {
      const { getProgramTransactionCount: getCached } = await import('@/lib/db');

      for (const slot of slotsToFetch) {
        const cached = getCached(slot, programId);
        if (cached !== null) {
          cacheHits++;
        }
      }

      cacheMisses = slotsToFetch.length - cacheHits;
      console.log(`Cache: ${cacheHits} hits, ${cacheMisses} misses for program ${programId}`);
    }

    // Process blocks in batches
    const batchSize = 5; // Smaller batch size for detailed program analysis

    for (let i = 0; i < slotsToFetch.length; i += batchSize) {
      const batch = slotsToFetch.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map(async (slot) => {
          try {
            const [programTxCount, blockInfo] = await Promise.all([
              this.getProgramTransactionCount(slot, programId, useCache),
              this.getBlockTransactionCount(slot),
            ]);

            return {
              programTxCount,
              networkTxCount: blockInfo,
            };
          } catch (error: any) {
            console.warn(`Failed to fetch slot ${slot}:`, error.message);
            return null;
          }
        })
      );

      for (const result of results) {
        if (result) {
          programTxCounts.push(result.programTxCount);
          networkTxCounts.push(result.networkTxCount);
        }
      }

      console.log(`Processed ${Math.min(i + batchSize, slotsToFetch.length)}/${slotsToFetch.length} blocks`);
    }

    const totalProgramTx = programTxCounts.reduce((sum, count) => sum + count, 0);
    const totalNetworkTx = networkTxCounts.reduce((sum, count) => sum + count, 0);
    const blocksSampled = programTxCounts.length;

    return {
      startSlot,
      endSlot,
      programId,
      totalBlocksSampled: blocksSampled,
      totalProgramTransactions: totalProgramTx,
      totalNetworkTransactions: totalNetworkTx,
      averageProgramTransactionsPerBlock: blocksSampled > 0 ? totalProgramTx / blocksSampled : 0,
      averageNetworkTransactionsPerBlock: blocksSampled > 0 ? totalNetworkTx / blocksSampled : 0,
      programPercentage: totalNetworkTx > 0 ? (totalProgramTx / totalNetworkTx) * 100 : 0,
      minProgramTransactions: programTxCounts.length > 0 ? Math.min(...programTxCounts) : 0,
      maxProgramTransactions: programTxCounts.length > 0 ? Math.max(...programTxCounts) : 0,
      cacheHits,
      cacheMisses,
    };
  }
}

// Create a singleton instance
export const solanaClient = new SolanaRPCClient(process.env.SOLANA_RPC_URL);
