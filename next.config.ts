import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller self-hosted output for cPanel Node.js apps
  output: "standalone",
  serverExternalPackages: ["mysql2", "sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
};

export default nextConfig;
