import { setData } from '@/lib/storage';

import type { CustomPropertyType } from '../custom-property/types';
import { importData } from './import-data';

jest.mock('localforage', () => ({
  default: {
    createInstance: jest.fn(() => ({
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    })),
  },
}));

jest.mock('@/lib/storage', () => ({
  setData: jest.fn(),
}));

describe('import-data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该导入数据并返回统计信息', async () => {
    const importDataMock = {
      exportedAt: new Date().toISOString(),
      repos: [],
      customData: {
        properties: [
          {
            id: '1',
            displayName: 'A',
            slug: 'a',
            type: 'text' as CustomPropertyType,
            order: 0,
          },
        ],
        values: [{ repoFullName: 'repo', propertyId: '1', value: 'test' }],
      },
    };
    (setData as jest.Mock).mockResolvedValue(undefined);

    const result = await importData(importDataMock);

    expect(result.propertiesCount).toBe(1);
    expect(result.valuesCount).toBe(1);
    expect(setData).toHaveBeenCalled();
  });
});
