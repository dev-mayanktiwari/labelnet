/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["https://res.cloudinary.com"],
  },
  output: "standalone",
  experimental: {
    outputFileTracingRoot: join(__dirname, "../../"),
  },
};

export default nextConfig;
