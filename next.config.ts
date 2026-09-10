import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/reset-password/:token",
        destination: "/api/auth/reset-password/:token",
      },
    ];
  },
};

export default nextConfig;
