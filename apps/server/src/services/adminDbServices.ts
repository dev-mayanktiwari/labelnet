import { prisma } from "@workspace/db";
import { TTaskSubmissionParams, TTaskSubmissionSchema } from "@workspace/types";

export class AdminDBServices {
  async createTask(data: TTaskSubmissionSchema, hash: TTaskSubmissionParams) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        totalReward: data.reward,
        maxParticipants: data.maxParticipants,
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
}

export const adminDbService = new AdminDBServices();
