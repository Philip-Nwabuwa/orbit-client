import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to complete even if ESLint finds issues.
    // This keeps CI/dev flows unblocked while we iterate on lint rules.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
