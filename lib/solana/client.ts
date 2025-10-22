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
}

// Create a singleton instance
export const solanaClient = new SolanaRPCClient();
