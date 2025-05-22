import { prisma } from "@workspace/db";
import {
  TResponseSubmissionSchema,
  TTaskSubmissionParams,
  TTaskSubmissionSchema,
} from "@workspace/types";

export class AdminDBServices {
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
}

export const adminDbService = new AdminDBServices();
