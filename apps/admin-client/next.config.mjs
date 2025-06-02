/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["https://res.cloudinary.com"],
  },
};

export default nextConfig;
