import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "NODE_ENV"
  | "JWT_SECRET"
  | "CLOUDINARY_API_SECRET"
  | "SOLANA_RPC_URL"
  | "ADMIN_PUBLIC_KEY"
  | "ADMIN_PRIVATE_KEY"
  | "SAFE_COOKIE";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
  ADMIN_PUBLIC_KEY: process.env.ADMIN_PUBLIC_KEY,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
  SAFE_COOKIE: process.env.SAFE_COOKIE,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      console.error(`Missing environment variable: ${key}`);
      process.exit(1);
    }

    return key === "PORT" ? Number(value) : value;
  },
};
