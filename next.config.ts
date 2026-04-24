import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  // Use standalone output
  output: "standalone",
  // Completely disable static generation
  trailingSlash: true,
};

export default nextConfig;
