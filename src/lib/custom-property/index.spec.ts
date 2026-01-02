import { getData, setData } from '@/lib/storage';

import {
  addProperty,
  deleteProperty,
  getProperties,
  reorderProperties,
  updateProperty,
} from './index';

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

describe('properties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('应该返回排序后的属性列表', async () => {
      const mockData = {
        properties: [
          { id: '2', displayName: 'B', slug: 'b', type: 'text', order: 1 },
          { id: '1', displayName: 'A', slug: 'a', type: 'text', order: 0 },
        ],
        values: [],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);

      const result = await getProperties();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('应该返回空数组当没有数据', async () => {
      (getData as jest.Mock).mockResolvedValue({
        properties: [],
        values: [],
      });

      const result = await getProperties();

      expect(result).toEqual([]);
    });
  });

  describe('addProperty', () => {
    it('应该添加新属性并返回', async () => {
      (getData as jest.Mock).mockResolvedValue({ properties: [], values: [] });
      (setData as jest.Mock).mockResolvedValue(undefined);

      const result = await addProperty('Test', 'test', 'text');

      expect(result).toMatchObject({
        displayName: 'Test',
        slug: 'test',
        type: 'text',
        order: 0,
      });
      expect(setData).toHaveBeenCalled();
    });
  });

  describe('updateProperty', () => {
    it('应该更新存在的属性', async () => {
      const mockData = {
        properties: [
          { id: '1', displayName: 'A', slug: 'a', type: 'text', order: 0 },
        ],
        values: [],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await updateProperty('1', { displayName: 'Updated' });

      expect(setData).toHaveBeenCalled();
      const updatedData = (setData as jest.Mock).mock.calls[0][0];
      expect(updatedData.properties[0].displayName).toBe('Updated');
    });

    it('不应该更新不存在的属性', async () => {
      const mockData = { properties: [], values: [] };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await updateProperty('non-existent', { displayName: 'Updated' });

      expect(setData).not.toHaveBeenCalled();
    });
  });

  describe('deleteProperty', () => {
    it('应该删除属性和相关值', async () => {
      const mockData = {
        properties: [
          { id: '1', displayName: 'A', slug: 'a', type: 'text', order: 0 },
        ],
        values: [
          { repoFullName: 'repo1', propertyId: '1', value: 'test' },
          { repoFullName: 'repo2', propertyId: '2', value: 'test2' },
        ],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await deleteProperty('1');

      const updatedData = (setData as jest.Mock).mock.calls[0][0];
      expect(updatedData.properties).toHaveLength(0);
      expect(updatedData.values).toHaveLength(1);
      expect(updatedData.values[0].propertyId).toBe('2');
    });
  });

  describe('reorderProperties', () => {
    it('应该重新排序属性', async () => {
      const mockData = {
        properties: [
          { id: '1', displayName: 'A', slug: 'a', type: 'text', order: 0 },
          { id: '2', displayName: 'B', slug: 'b', type: 'text', order: 1 },
        ],
        values: [],
      };
      (getData as jest.Mock).mockResolvedValue(mockData);
      (setData as jest.Mock).mockResolvedValue(undefined);

      await reorderProperties(['2', '1']);

      const updatedData = (setData as jest.Mock).mock.calls[0][0];
      expect(updatedData.properties[0].id).toBe('2');
      expect(updatedData.properties[0].order).toBe(0);
      expect(updatedData.properties[1].id).toBe('1');
      expect(updatedData.properties[1].order).toBe(1);
    });
  });
});
