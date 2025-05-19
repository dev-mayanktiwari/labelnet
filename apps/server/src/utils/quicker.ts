import { v6 } from "uuid";
import os from "os";
import dayjs from "dayjs";
import nacl from "tweetnacl";
import { TokenPayload } from "@workspace/types";
import { sign } from "jsonwebtoken";
import { AppConfig } from "../config";

// THIS NEEDED TO BE FIXED
let bs58: any;
(async () => {
  bs58 = (await import("bs58")).default;
})();

export default {
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
    };
  },
  getApplicationHealth: () => {
    return {
      environment: AppConfig.get("NODE_ENV"),
      uptime: `${process.uptime().toFixed(2)} seconds`,
      memoryUsage: {
        totalHeap: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
          2
        )} MB`,
        usedHeap: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB`,
      },
    };
  },
  generateVerifyToken: () => {
    const token = v6();
    return token;
  },
  generateCode: (n: number) => {
    if (n <= 0) {
      return null;
    }
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  verifyWalletAddress: async (
    publicKey: string,
    signature: string,
    message: string
  ) => {
    if (!bs58) {
      bs58 = (await import("bs58")).default;
    }
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    const messageBytes = new TextEncoder().encode(message);
    const isValid = await nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    return isValid;
  },
  generateExpiryTime: (minutes: number) => {
    return dayjs().add(minutes, "minutes").toISOString();
  },
  generateJWTToken: async (data: TokenPayload) => {
    const token = await sign(data, String(AppConfig.get("JWT_SECRET")), {
      expiresIn: "30d",
    });
    return token;
  },
};
