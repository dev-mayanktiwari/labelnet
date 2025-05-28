import { prisma } from "@workspace/db";
import { TTaskSubmissionParams, TTaskSubmissionSchema } from "@workspace/types";

export class AdminDBServices {
  async createAdmin(publicKey: string) {
    return prisma.admin.upsert({
      where: { walletAddress: publicKey },
      create: { walletAddress: publicKey },
      update: {},
    });
  }

  async createTask(
    data: TTaskSubmissionSchema,
    hash: TTaskSubmissionParams,
    adminId: string
  ) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        totalReward: data.reward,
        maxParticipants: data.maxParticipants,
        admin: {
          connect: {
            adminId: adminId,
          },
        },
        options: {
          createMany: {
            data: data.images.map((image) => ({
              url: image,
            })),
          },
        },
        trasactionHash: hash.hash,
      },
    });
  }

  async getAllTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        adminId: userId,
      },
      include: {
        options: true,
        submissions: true,
        timeAnalytics: true,
      },
    });
  }

  async pauseTask(taskId: number, adminId: string) {
    return prisma.task.update({
      where: {
        taskId: taskId,
        adminId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async getTask(taskId: number, adminId: string) {
    return prisma.task.findUnique({
      where: {
        taskId: taskId,
        adminId,
      },
      include: {
        options: true,
        submissions: true,
        timeAnalytics: true,
      },
    });
  }

  async updateAverageTime(
    taskId: number,
    adminId: string,
    averageTime: number
  ) {
    return prisma.task.update({
      where: {
        taskId: taskId,
        adminId,
      },
      data: {
        averageTime: averageTime,
      },
      include: {
        options: true,
        submissions: true,
        timeAnalytics: true,
        admin: true,
      },
    });
  }
}

export const adminDbService = new AdminDBServices();
