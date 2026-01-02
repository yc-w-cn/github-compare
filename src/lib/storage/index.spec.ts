import * as localforage from 'localforage';

const mockStore = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('localforage', () => ({
  createInstance: jest.fn(() => mockStore),
}));

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    it('应该返回存储的数据', async () => {
      const mockData = {
        properties: [
          { id: '1', displayName: 'A', slug: 'a', type: 'text', order: 0 },
        ],
        values: [],
      };
      mockStore.getItem.mockResolvedValue(mockData);

      const { getData } = require('./index');
      const result = await getData();

      expect(result).toEqual(mockData);
    });

    it('应该返回默认数据当没有存储数据', async () => {
      mockStore.getItem.mockResolvedValue(null);

      const { getData } = require('./index');
      const result = await getData();

      expect(result).toEqual({ properties: [], values: [] });
    });
  });

  describe('setData', () => {
    it('应该保存数据', async () => {
      const mockData = { properties: [], values: [] };
      mockStore.setItem.mockResolvedValue(undefined);

      const { setData } = require('./index');
      await setData(mockData);

      expect(mockStore.setItem).toHaveBeenCalledWith(
        'custom-compare-data',
        mockData,
      );
    });
  });

  describe('clearAllData', () => {
    it('应该清除所有数据', async () => {
      mockStore.removeItem.mockResolvedValue(undefined);

      const { clearAllData } = require('./index');
      await clearAllData();

      expect(mockStore.removeItem).toHaveBeenCalledWith('custom-compare-data');
    });
  });
});
