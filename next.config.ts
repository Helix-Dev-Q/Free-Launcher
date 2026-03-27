import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias["@apps-socket/core"] = path.resolve(
      __dirname,
      "src/core"
    );
    return config;
  },
};

export default nextConfig;
