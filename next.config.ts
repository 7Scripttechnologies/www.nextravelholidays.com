import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2", "sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
    memoryBasedWorkersCount: false,
  },
  turbopack: {},
  webpack: (config) => {
    config.parallelism = 1;
    return config;
  },
  async rewrites() {
    return [{ source: "/uploads/:filename", destination: "/api/media/:filename" }];
  },
  images: {
    unoptimized: true,
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/uploads/**" },
      { pathname: "/api/media/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
};

export default nextConfig;
