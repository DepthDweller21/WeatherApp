import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use webpack instead of Turbopack - it has issues with TypeORM decorators
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure reflect-metadata works on server side
      config.externals = config.externals || [];
    }
    return config;
  },
};

export default nextConfig;