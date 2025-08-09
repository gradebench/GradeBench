import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@gb/ui"],
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/site/home",
      },
      {
        source: "/site",
        destination: "/site/home",
      },
    ];
  },
};

export default nextConfig;
