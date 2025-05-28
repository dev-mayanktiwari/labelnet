import { prisma, PrismaClient } from "@workspace/db";

export class PayoutService {
  constructor(private prismaClient: PrismaClient) {}


  async createPayout(userId: string, amount: number) {
    // Logic to create a payout in the database
    return this.prismaClient.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          userId,
        },
      });

      if (!user || user.pendingAmount < amount) {
        throw new Error("User not found");
      }

      await tx.user.update({
        where: {
          userId,
        },
        data: {
          pendingAmount: { decrement: amount },
          lockedAmount: {
            increment: amount,
          },
        },
      });

      const payout = await tx.payout.create({
        data: {
          user: {
            connect: {
              userId,
            },
          },
          status: "PENDING",
          amount: amount,
          blockChainConfirmation: false,
          retryCount: 0,
        },
      });

      return payout;
    });
  }

  async updatePayoutWithTransaction(payoutId: number, transactionHash: string) {
    return this.prismaClient.payout.update({
      where: {
        payoutId: payoutId,
      },
      data: {
        transactionHash,
        status: "PROCESSING",
        updatedAt: new Date(),
      },
    });
  }

  async confirmPayout(payoutId: number) {
    return this.prismaClient.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({
        where: {
          payoutId,
        },
      });

      if (!payout) {
        throw new Error("Payout not found");
      }

      await tx.payout.update({
        where: {
          payoutId,
        },
        data: {
          status: "SUCCESS",
          blockChainConfirmation: true,
          processedAt: new Date(),
        },
      });

      await tx.user.update({
        where: {
          userId: payout.userId,
        },
        data: {
          lockedAmount: { decrement: payout.amount },
        },
      });
    });
  }

  async failPayout(payoutId: number, reason: string) {
    await this.prismaClient.$transaction(async (tx) => {
      const payout = await tx.payout.findUnique({
        where: {
          payoutId,
        },
      });

      if (!payout) {
        throw new Error("Payout not found");
      }

      await tx.payout.update({
        where: {
          payoutId,
        },
        data: {
          status: "FAILED",
          blockChainConfirmation: false,
          retryCount: {
            increment: 1,
          },
          failureReason: reason,
        },
      });

      await tx.user.update({
        where: {
          userId: payout.userId,
        },
        data: {
          pendingAmount: { increment: payout.amount },
          lockedAmount: { decrement: payout.amount },
        },
      });
    });
  }

  async getPendingPayouts() {
    return this.prismaClient.payout.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          { status: "PROCESSING", retryCount: { lt: 3 } },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const payoutService = new PayoutService(prisma);
