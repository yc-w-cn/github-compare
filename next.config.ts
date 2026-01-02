import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/github-compare',
  assetPrefix: '/github-compare',
};

export default nextConfig;
