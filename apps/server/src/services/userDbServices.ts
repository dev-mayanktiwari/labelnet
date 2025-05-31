import { prisma } from "@workspace/db";
import { TResponseSubmissionSchema } from "@workspace/types";
import { SolanaAmountUtils } from "@workspace/utils";

class UserDBServices {
  async createUser(publicKey: string) {
    return prisma.user.upsert({
      where: { walletAddress: publicKey },
      create: { walletAddress: publicKey },
      update: {},
    });
  }

  async findUser(userId: string) {
    return prisma.user.findUnique({
      where: {
        userId,
      },
    });
  }

  async getNextTask(userId: string) {
    return prisma.task.findFirst({
      where: {
        submissions: {
          none: {
            userId,
          },
        },
      },
    });
  }

  async getUndoneTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        submissions: { none: { userId } },
        isActive: true,
      },
    });
  }

  async getDoneTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        submissions: { some: { userId } },
        isActive: true,
      },
    });
  }

  async submitResponse(data: TResponseSubmissionSchema, userId: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          userId,
        },

        select: {
          userId: true,
          pendingAmount: true,
          lockedAmount: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const task = await tx.task.findUnique({
        where: {
          taskId: data.taskId,
          isActive: true,
        },
      });

      if (!task || task.maxParticipants === task.filledParticipants) {
        throw new Error("Task not found or expired.");
      }

      const option = await tx.option.findUnique({
        where: {
          id: data.optionId,
        },
      });

      if (!option) {
        throw new Error("Option not found");
      }

      const submission = await tx.submission.create({
        data: {
          taskId: task.taskId,
          optionId: option.id,
          userId,
        },
      });

      const updatedTask = await tx.task.update({
        where: {
          taskId: task.taskId,
        },
        data: {
          filledParticipants: { increment: 1 },
        },
      });

      if (updatedTask.filledParticipants === task.maxParticipants) {
        await tx.task.update({
          where: {
            taskId: task.taskId,
          },
          data: {
            isActive: false,
          },
        });
      }

      const amount = SolanaAmountUtils.divideLamports(
        task.totalReward,
        task.maxParticipants
      );

      const updatedPendingAmount = SolanaAmountUtils.addLamports(
        user.pendingAmount,
        amount
      );

      const updatedUser = await tx.user.update({
        where: {
          userId,
        },
        data: {
          pendingAmount: updatedPendingAmount,
        },
      });

      await tx.timeAnalytics.create({
        data: {
          taskId: task.taskId,
          userId,
          timeTaken: data.timeTaken,
        },
      });

      return {
        success: true,
        submission: submission,
        user: updatedUser,
        task: updatedTask,
      };
    });
  }

  // async payout(userId: string, amount: number, hash: string) {
  //   return prisma.$transaction(async (tx) => {
  //     const user = await tx.user.update({
  //       where: {
  //         userId,
  //       },
  //       data: {
  //         pendingAmount: { decrement: amount },
  //         lockedAmount: {
  //           increment: amount,
  //         },
  //       },
  //     });

  //     if (user.pendingAmount < 0) {
  //       throw new Error("Invalid transaction. Can't fetch twice.");
  //     }

  //     const payout = await tx.payout.create({
  //       data: {
  //         user: {
  //           connect: {
  //             userId,
  //           },
  //         },
  //         status: "PENDING",
  //         amount: amount,
  //         transactionHash: hash,
  //       },
  //     });

  //     return {
  //       success: true,
  //       user,
  //       payout,
  //     };
  //   });
  // }

  async getTaskById(userId: string, taskId: number) {
    return prisma.task.findFirst({
      where: {
        taskId,
        isActive: true,
        submissions: {
          none: {
            userId,
          },
        },
      },
      include: {
        options: true,
        submissions: true,
        timeAnalytics: true,
      },
    });
  }
}

export const userDbService = new UserDBServices();
