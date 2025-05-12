import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactive les erreurs ESLint pendant le build (utile pour Vercel)
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
