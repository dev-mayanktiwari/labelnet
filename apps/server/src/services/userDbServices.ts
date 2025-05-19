import { prisma } from "@workspace/db";

class UserDBServices {
  async createUser(publicKey: string) {
    return prisma.user.upsert({
      where: { walletAddress: publicKey },
      create: { walletAddress: publicKey },
      update: {},
    });
  }
}

export const userDbService = new UserDBServices();
