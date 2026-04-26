import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cmiev.ch",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/therapeutes",
        destination: "/fr/praticiens",
        permanent: true,
      },
      {
        source: "/fr/therapeutes",
        destination: "/fr/praticiens",
        permanent: true,
      },
      {
        source: "/:locale/therapeutes",
        destination: "/:locale/praticiens",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
