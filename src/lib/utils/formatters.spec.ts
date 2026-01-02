import {
  formatNumber,
  formatDate,
  formatSize,
} from './formatters';

describe('formatters', () => {
  describe('formatNumber', () => {
    it('应该返回 "1.5M" 当输入 1500000', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    it('应该返回 "1.0M" 当输入 1000000', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
    });

    it('应该返回 "1.5K" 当输入 1500', () => {
      expect(formatNumber(1500)).toBe('1.5K');
    });

    it('应该返回 "1.0K" 当输入 1000', () => {
      expect(formatNumber(1000)).toBe('1.0K');
    });

    it('应该返回 "500" 当输入 500', () => {
      expect(formatNumber(500)).toBe('500');
    });

    it('应该返回 "0" 当输入 0', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('应该正确格式化日期字符串', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{4}\/\d{2}\/\d{2}/);
    });
  });

  describe('formatSize', () => {
    it('应该返回 "1.5 MB" 当输入 1536', () => {
      expect(formatSize(1536)).toBe('1.5 MB');
    });

    it('应该返回 "500 KB" 当输入 500', () => {
      expect(formatSize(500)).toBe('500 KB');
    });
  });
});
