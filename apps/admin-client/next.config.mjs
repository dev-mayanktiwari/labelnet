/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["https://res.cloudinary.com"],
  },
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

export default nextConfig;
