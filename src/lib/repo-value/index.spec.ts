import { getData, setData } from '@/lib/storage';

import { getRepoValue, getRepoValues, setRepoValue } from './index';

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
  getData: jest.fn(),
  setData: jest.fn(),
}));

describe('values', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRepoValue', () => {
    it('应该返回仓库的属性值', async () => {
      const mockData = {
        properties: [],
        values: [
          { repoFullName: 'owner/repo', propertyId: '1', value: 'test-value' },
        ],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);

      const result = await getRepoValue('owner/repo', '1');

      expect(result).toBe('test-value');
    });

    it('应该返回 null 当值不存在', async () => {
      const mockData = { properties: [], values: [] };
      (getData as jest.Mock).mockResolvedValue(mockData);

      const result = await getRepoValue('owner/repo', '1');

      expect(result).toBeNull();
    });
  });

  describe('setRepoValue', () => {
    it('应该设置新的仓库属性值', async () => {
      const mockData = { properties: [], values: [] };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await setRepoValue('owner/repo', '1', 'new-value');

      const updatedData = (setData as jest.Mock).mock.calls[0][0];
      expect(updatedData.values).toHaveLength(1);
      expect(updatedData.values[0].value).toBe('new-value');
    });

    it('应该更新已存在的仓库属性值', async () => {
      const mockData = {
        properties: [],
        values: [
          { repoFullName: 'owner/repo', propertyId: '1', value: 'old-value' },
        ],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await setRepoValue('owner/repo', '1', 'new-value');

      const updatedData = (setData as jest.Mock).mock.calls[0][0];
      expect(updatedData.values[0].value).toBe('new-value');
      expect(updatedData.values).toHaveLength(1);
    });
  });

  describe('getRepoValues', () => {
    it('应该返回仓库的所有属性值', async () => {
      const mockData = {
        properties: [],
        values: [
          { repoFullName: 'owner/repo', propertyId: '1', value: 'value1' },
          { repoFullName: 'owner/repo', propertyId: '2', value: 'value2' },
          { repoFullName: 'other/repo', propertyId: '1', value: 'value3' },
        ],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);

      const result = await getRepoValues('owner/repo');

      expect(result).toHaveLength(2);
      expect(result[0].repoFullName).toBe('owner/repo');
    });
  });
});
