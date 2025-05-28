/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
