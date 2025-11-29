import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/multi-fw-demo/nextjs",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
