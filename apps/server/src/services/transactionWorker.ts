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
    private pollIntervalMs: number = 10000
  ) {}

  start(): void {
    if (this.isRunning) {
      logger.info("Transaction worker is already running", {
        meta: {
          intervalMs: this.pollIntervalMs,
        },
      });
      return;
    }

    this.isRunning = true;
    logger.info("Transaction worker started", {
      intervalMs: this.pollIntervalMs,
    });

    this.intervalId = setInterval(async () => {
      try {
        await this.processTransactions();
      } catch (error) {
        logger.error("Error in transaction worker loop", {
          meta: {
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
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
    logger.info("Transaction worker stopped");
  }

  private async processTransactions(): Promise<void> {
    const pendingTransactions = await this.payoutService.getPendingPayouts();

    if (pendingTransactions.length === 0) {
      logger.debug("No pending transactions to process");
      return;
    }

    logger.info("Processing pending transactions", {
      meta: { count: pendingTransactions.length },
    });

    for (const payout of pendingTransactions) {
      try {
        await this.processTransaction(payout);
      } catch (error) {
        logger.error("Error processing transaction", {
          meta: {
            payoutId: payout.payoutId,
            userId: payout.userId,
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        });

        // If we hit an unexpected error, mark the payout as failed
        try {
          await this.payoutService.failPayout(
            payout.payoutId,
            `Unexpected error: ${String(error)}`
          );
        } catch (failError) {
          logger.error("Failed to mark payout as failed", {
            meta: {
              payoutId: payout.payoutId,
              error: String(failError),
            },
          });
        }
      }
    }
  }

  private async processTransaction(payout: Payout): Promise<void> {
    logger.info("Processing transaction", {
      meta: {
        payoutId: payout.payoutId,
        userId: payout.userId,
        status: payout.status,
        retryCount: payout.retryCount,
      },
    });

    if (!payout.transactionHash) {
      logger.warn("Transaction hash missing", {
        meta: { payoutId: payout.payoutId, retryCount: payout.retryCount },
      });

      if (payout.retryCount >= 3) {
        await this.payoutService.failPayout(
          payout.payoutId,
          "Transaction hash never received after 3 retries"
        );
        return;
      }
      return;
    }

    try {
      const status = await this.solanaService.getTransactionStatus(
        String(payout.transactionHash)
      );

      logger.info("Transaction status check", {
        meta: { payoutId: payout.payoutId, status: status },
      });

      if (status.confirmed) {
        logger.info("Transaction confirmed", {
          meta: {
            payoutId: payout.payoutId,
            transactionHash: payout.transactionHash,
          },
        });

        const updatedUser = await this.payoutService.confirmPayout(
          payout.payoutId
        );

        logger.info("Payout confirmed and user balance updated", {
          meta: {
            payoutId: payout.payoutId,
            userId: payout.userId,
            finalBalance: {
              pendingAmount: updatedUser.pendingAmount,
              lockedAmount: updatedUser.lockedAmount,
            },
          },
        });
      } else if (status.error) {
        logger.error("Transaction failed", {
          meta: {
            payoutId: payout.payoutId,
            transactionHash: payout.transactionHash,
            error: status.error,
          },
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
          logger.error("Transaction timeout", {
            meta: { payoutId: payout.payoutId, minutesElapsed },
          });

          await this.payoutService.failPayout(
            payout.payoutId,
            "Transaction not confirmed within 10 minutes"
          );
        } else {
          logger.debug("Transaction still pending", {
            meta: { payoutId: payout.payoutId, minutesElapsed },
          });
        }
      }
    } catch (error) {
      logger.error("Error checking transaction status", {
        meta: {
          payoutId: payout.payoutId,
          transactionHash: payout.transactionHash,
          error: String(error),
        },
      });

      if (payout.retryCount >= 5) {
        await this.payoutService.failPayout(
          payout.payoutId,
          `Max retry count reached: ${String(error)}`
        );
      }
      throw error; // Re-throw to be caught by the outer try-catch
    }
  }
}

export const transactionWorker = new TransactionWorker(
  solanaService,
  payoutService
);
