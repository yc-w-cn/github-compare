import { readFileSync } from 'fs';
import { join } from 'path';

import type { NextConfig } from 'next';

import dayjs from 'dayjs';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
);

const today = new Date();
const buildDate = dayjs(today).format('YYYY-MM-DD');

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/github-compare',
  assetPrefix: '/github-compare',
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
};

export default nextConfig;
