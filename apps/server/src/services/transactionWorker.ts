import { logger } from "@workspace/utils";
import { payoutService, PayoutService } from "./payoutDbService";
import { solanaService, SolanaService } from "./solanaService";
import { Payout } from "@workspace/db";

export class TransactionWorker {
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  constructor(
    private solanaService: SolanaService,
    private payoutService: PayoutService,
    private pollIntervalMs: number = 10000 // Default interval of 5 seconds
  ) {}

  start(): void {
    if (this.isRunning) {
      logger.info("Transaction worker is running.", {
        meta: {
          intervalMs: this.pollIntervalMs,
        },
      });
      return;
    }

    this.isRunning = true;
    logger.info("Transaction worker started.", {
      meta: {
        intervalMs: this.pollIntervalMs,
      },
    });

    this.intervalId = setInterval(async () => {
      try {
        await this.processTransactions();
      } catch (error) {
        console.log("Error processing transactions", error);
        logger.error("Error processing transactions", {
          error: String(error),
        });
      }
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
    logger.info("Transaction worker stopped.");
  }

  private async processTransactions(): Promise<void> {
    const pendingTransactions = await this.payoutService.getPendingPayouts();

    if (pendingTransactions.length === 0) {
      logger.info("No pending transactions to process.");
      return;
    }

    for (const payout of pendingTransactions) {
      try {
        await this.processTransaction(payout);
      } catch (error) {
        console.error("Error processing transaction", error);
        logger.error("Error processing transaction", {
          payoutId: payout.payoutId,
          error: String(error),
        });
      }
    }
  }

  private async processTransaction(payout: Payout): Promise<void> {
    if (!payout.transactionHash) {
      if (payout.retryCount >= 3) {
        await this.payoutService.failPayout(
          payout.payoutId,
          "Transaction never reached the blockchain"
        );
        logger.error("Max retry count reached for payout", {
          payoutId: payout.payoutId,
        });
        return;
      }
    }

    try {
      const status = await this.solanaService.getTransactionStatus(
        String(payout.transactionHash)
      );

      if (status.confirmed) {
        logger.info("Transaction succedeed", {
          payoutId: payout.payoutId,
          transactionHash: payout.transactionHash,
        });
        await this.payoutService.confirmPayout(payout.payoutId);
      } else if (status.error) {
        logger.error("Transaction failed", {
          payoutId: payout.payoutId,
          transactionHash: payout.transactionHash,
          error: status.error,
        });
        await this.payoutService.failPayout(
          payout.payoutId,
          `Transaction failed: ${status.error}`
        );
      } else {
        const now = new Date();
        const createdAt = new Date(payout.createdAt);
        const minutesElapsed =
          (now.getTime() - createdAt.getTime()) / (1000 * 60);

        if (minutesElapsed > 10) {
          await this.payoutService.failPayout(
            payout.payoutId,
            "Transaction not confirmed within 10 minutes"
          );
          logger.error("Transaction not confirmed within 10 minutes", {
            payoutId: payout.payoutId,
          });
        }
      }
    } catch (error) {
      logger.error("Error confirming transaction", {
        payoutId: payout.payoutId,
        error: String(error),
      });

      if (payout.retryCount >= 5) {
        await this.payoutService.failPayout(
          payout.payoutId,
          `Max retry count reached: ${String(error)}`
        );
        logger.error("Max retry count reached for payout", {
          payoutId: payout.payoutId,
        });
      }
    }
  }
}

export const transactionWorker = new TransactionWorker(
  solanaService,
  payoutService
);
