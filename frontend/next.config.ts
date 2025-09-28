import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    domains: [],
  },
  typescript: {
    // Enable strict type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
