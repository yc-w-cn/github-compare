import { getData } from '@/lib/storage';

import { GitHubRepo } from '../github/types';
import { ExportData } from './types';

export async function exportData(repos: GitHubRepo[]): Promise<ExportData> {
  const customData = await getData();
  return {
    exportedAt: new Date().toISOString(),
    repos,
    customData,
  };
}
