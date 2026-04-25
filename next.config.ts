import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  trailingSlash: true,
};

export default nextConfig;
