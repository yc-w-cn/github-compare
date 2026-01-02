import { cn } from './tailwind';

describe('cn', () => {
  it('应该合并多个类名', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('应该处理条件类名', () => {
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
  });

  it('应该处理对象形式的类名', () => {
    expect(cn({ class1: true, class2: false })).toBe('class1');
  });

  it('应该处理数组形式的类名', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('应该处理 Tailwind 冲突类名', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });

  it('应该返回空字符串当没有类名', () => {
    expect(cn()).toBe('');
  });
});
