import { setData } from '@/lib/storage';

import type { ExportData } from './types';

export async function importData(
  exportData: ExportData,
): Promise<{ propertiesCount: number; valuesCount: number }> {
  await setData(exportData.customData);
  return {
    propertiesCount: exportData.customData.properties.length,
    valuesCount: exportData.customData.values.length,
  };
}
