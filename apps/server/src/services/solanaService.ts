import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { AppConfig } from "../config";

export class SolanaService {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
  }

  async sendTransaction(transaction: Transaction, signers: Keypair[]) {
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        signers,
        {
          maxRetries: 3,
          commitment: "confirmed",
          skipPreflight: false,
        }
      );
      return signature;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw new Error("Transaction failed");
    }
  }

  async getTransactionStatus(signature: string) {
    try {
      const status = await this.connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });

      if (!status.value) {
        throw new Error("Transaction not found");
      }

      return {
        confirmed:
          status.value.confirmationStatus === "confirmed" ||
          status.value.confirmationStatus === "finalized",
        finalized: status.value.confirmationStatus === "finalized",
        error: status.value.err ? String(status.value.err) : null,
      };
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      return { confirmed: false, finalized: false, error: String(error) };
    }
  }

  async isTransactionConfirmed(signature: string) {
    const status = await this.getTransactionStatus(signature);
    return status.confirmed;
  }
}

export const solanaService = new SolanaService(
  String(AppConfig.get("SOLANA_RPC_URL"))
);
