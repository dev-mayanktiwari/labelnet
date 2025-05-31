import { prisma, PrismaClient } from "@workspace/db";
import { logger, SolanaAmountUtils } from "@workspace/utils";

export class PayoutService {
  constructor(private prismaClient: PrismaClient) {}

  async createPayout(userId: string, amount: string) {
    logger.info("Creating payout", { meta: { userId, amount } });

    return this.prismaClient.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      if (!user) {
        logger.error("User not found for payout", {
          meta: {
            userId,
          },
        });
        throw new Error("User not found");
      }

      logger.info("User balance before payout", {
        meta: {
          userId,
          pendingAmount: SolanaAmountUtils.lamportsToSolStringFrontend(
            user.pendingAmount
          ),
          lockedAmount: SolanaAmountUtils.lamportsToSolStringFrontend(
            user.lockedAmount
          ),
          requestedAmount: SolanaAmountUtils.lamportsToSolStringFrontend(
            String(amount)
          ),
        },
      });

      if (
        SolanaAmountUtils.compareLamports(user.pendingAmount, String(amount))
      ) {
        logger.error("Insufficient pending balance", {
          meta: {
            userId,
            pendingAmount: SolanaAmountUtils.lamportsToSolStringFrontend(
              user.pendingAmount
            ),
            requestedAmount: SolanaAmountUtils.lamportsToSolStringFrontend(
              String(amount)
            ),
          },
        });
        throw new Error("Insufficient pending balance");
      }

      const updatedPendingAmount = SolanaAmountUtils.subtractLamports(
        user.pendingAmount,
        String(amount)
      );
      const updatedLockedAmount = SolanaAmountUtils.addLamports(
        user.lockedAmount,
        String(amount)
      );

      const updatedUser = await tx.user.update({
        where: { userId },
        data: {
          pendingAmount: updatedPendingAmount,
          lockedAmount: updatedLockedAmount,
        },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      logger.info("User balance after payout creation", {
        meta: {
          userId,
          pendingAmount: updatedUser.pendingAmount,
          lockedAmount: updatedUser.lockedAmount,
        },
      });

      const payout = await tx.payout.create({
        data: {
          user: { connect: { userId } },
          status: "PENDING",
          amount: String(amount),
          blockChainConfirmation: false,
          retryCount: 0,
        },
      });

      logger.info("Payout created successfully", {
        meta: {
          payoutId: payout.payoutId,
          userId,
          amount,
        },
      });

      return { updatedUser, payout };
    });
  }

  async updatePayoutWithTransaction(payoutId: number, transactionHash: string) {
    logger.info("Updating payout with transaction", {
      meta: { payoutId, transactionHash },
    });

    return this.prismaClient.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({
        where: { payoutId },
        include: { user: true },
      });

      if (!payout) {
        logger.error("Payout not found for transaction update", {
          meta: { payoutId },
        });
        throw new Error("Payout not found");
      }

      logger.info("Payout status before update", {
        meta: { payoutId, status: payout.status, userId: payout.userId },
      });

      const updatedPayout = await tx.payout.update({
        where: { payoutId },
        data: {
          transactionHash,
          status: "PROCESSING",
          updatedAt: new Date(),
        },
        include: { user: true },
      });

      logger.info("Payout updated with transaction", {
        meta: { payoutId, status: payout.status },
      });

      return updatedPayout;
    });
  }

  async confirmPayout(payoutId: number) {
    logger.info("Confirming payout", { meta: { payoutId } });

    return this.prismaClient.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({
        where: { payoutId },
        include: { user: true },
      });

      if (!payout) {
        logger.error("Payout not found for confirmation", { payoutId });
        throw new Error("Payout not found");
      }

      if (payout.status !== "PROCESSING") {
        logger.error("Invalid payout status for confirmation", {
          meta: { payoutId, status: payout.status },
        });
        throw new Error("Invalid payout status for confirmation");
      }

      logger.info("User balance before confirmation", {
        meta: {
          userId: payout.userId,
          pendingAmount: payout.user.pendingAmount,
          lockedAmount: payout.user.lockedAmount,
        },
      });

      const user = await tx.user.findUnique({
        where: { userId: payout.userId },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      if (!user) {
        logger.error("User not found for payout confirmation", {
          meta: { userId: payout.userId },
        });
        throw new Error("User not found");
      }

      const updatedPayout = await tx.payout.update({
        where: { payoutId },
        data: {
          status: "SUCCESS",
          blockChainConfirmation: true,
          processedAt: new Date(),
        },
      });

      const updatedUser = await tx.user.update({
        where: { userId: payout.userId },
        data: {
          lockedAmount: SolanaAmountUtils.subtractLamports(
            user.lockedAmount,
            payout.amount
          ),
        },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      logger.info("Payout confirmed successfully", {
        meta: {
          payoutId,
          userId: payout.userId,
          finalBalance: {
            pendingAmount: updatedUser.pendingAmount,
            lockedAmount: updatedUser.lockedAmount,
          },
        },
      });

      return updatedUser;
    });
  }

  async failPayout(payoutId: number, reason: string) {
    logger.info("Failing payout", { payoutId, reason });

    return this.prismaClient.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({
        where: { payoutId },
        include: { user: true },
      });

      if (!payout) {
        logger.error("Payout not found for failure", { payoutId });
        throw new Error("Payout not found");
      }

      logger.info("User balance before failure", {
        meta: {
          userId: payout.userId,
          pendingAmount: payout.user.pendingAmount,
          lockedAmount: payout.user.lockedAmount,
        },
      });

      const user = await tx.user.findUnique({
        where: { userId: payout.userId },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      if (!user) {
        logger.error("User not found for payout failure", {
          meta: { userId: payout.userId },
        });
        throw new Error("User not found");
      }

      const updatedPayout = await tx.payout.update({
        where: { payoutId },
        data: {
          status: "FAILED",
          blockChainConfirmation: false,
          retryCount: { increment: 1 },
          failureReason: reason,
        },
      });

      const updatedUser = await tx.user.update({
        where: { userId: payout.userId },
        data: {
          pendingAmount: SolanaAmountUtils.addLamports(
            user.pendingAmount,
            payout.amount
          ),
          lockedAmount: SolanaAmountUtils.subtractLamports(
            user.lockedAmount,
            payout.amount
          ),
        },
        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      logger.info("Payout failed and balances reverted", {
        meta: {
          payoutId,
          userId: payout.userId,
          finalBalance: {
            pendingAmount: updatedUser.pendingAmount,
            lockedAmount: updatedUser.lockedAmount,
          },
        },
      });

      return { updatedPayout, updatedUser };
    });
  }

  async getPendingPayouts() {
    const payouts = await this.prismaClient.payout.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          { status: "PROCESSING", retryCount: { lt: 3 } },
        ],
      },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    logger.info("Retrieved pending payouts", {
      meta: {
        count: payouts.length,
        payouts: payouts.map((p) => ({
          payoutId: p.payoutId,
          status: p.status,
          userId: p.userId,
        })),
      },
    });

    return payouts;
  }
}

export const payoutService = new PayoutService(prisma);
