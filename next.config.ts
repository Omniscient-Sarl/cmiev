import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cmiev.ch",
      },
    ],
  },
};

export default nextConfig;
