import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  serverExternalPackages: ["pg"],
  experimental: { optimizePackageImports: ["drizzle-orm"] },
};

export default nextConfig;
