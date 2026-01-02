# 单元测试规范指南

## 依赖安装

在开始编写测试之前，请先安装必要的依赖：

```bash
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom
```

## 测试环境配置

### Jest 配置文件

在项目根目录创建 `jest.config.ts`：

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/**/*.stories.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
```

### Jest 设置文件

在项目根目录创建 `jest.setup.ts`：

```typescript
// 全局测试配置
// 可以在这里添加全局的 Mock 或测试工具
```

### package.json 脚本

在 `package.json` 中添加测试相关脚本：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## 测试文件规范

### 命名规范

- 测试文件命名: `原文件名.spec.ts`
- 测试文件位置: 与源文件同级目录
- 示例:
  - `src/lib/formatters.ts` → `src/lib/formatters.spec.ts`
  - `src/lib/utils.ts` → `src/lib/utils.spec.ts`
  - `src/lib/custom-compare.ts` → `src/lib/custom-compare.spec.ts`

### 文件结构

```typescript
// 1. 导入依赖
import { functionName } from './module';

// 2. 定义 Mock (如果需要)
jest.mock('dependency');

// 3. 测试分组
describe('模块名称', () => {
  // 4. 测试套件
  describe('functionName', () => {
    // 5. 测试用例
    it('应该返回预期结果', () => {
      // Arrange (准备)
      const input = 'test';

      // Act (执行)
      const result = functionName(input);

      // Assert (断言)
      expect(result).toBe('expected');
    });
  });
});
```

## 测试覆盖率目标

### 覆盖率指标

- **语句覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 75%
- **函数覆盖率**: ≥ 80%
- **行覆盖率**: ≥ 80%

### 查看覆盖率报告

```bash
# 运行测试并生成覆盖率报告
pnpm test:coverage

# 报告将生成在 coverage/ 目录下
# 打开 coverage/lcov-report/index.html 查看详细报告
```

## 测试编写规范

### AAA 模式

每个测试用例遵循 AAA 模式：

```typescript
it('应该正确格式化数字', () => {
  // Arrange (准备): 准备测试数据和 Mock
  const input = 1500000;

  // Act (执行): 调用被测试的函数
  const result = formatNumber(input);

  // Assert (断言): 验证结果是否符合预期
  expect(result).toBe('1.5M');
});
```

### 测试命名规范

- 使用中文描述测试意图
- 格式: `应该[预期行为]当[条件]`
- 示例:
  - `应该返回 '1.5M' 当输入 1500000`
  - `应该返回 '500' 当输入 500`
  - `应该抛出错误当输入无效`

### 测试分组

使用 `describe` 组织相关测试：

```typescript
describe('formatNumber', () => {
  describe('百万级别', () => {
    it('应该返回 "1.5M" 当输入 1500000', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });
  });

  describe('千级别', () => {
    it('应该返回 "1.5K" 当输入 1500', () => {
      expect(formatNumber(1500)).toBe('1.5K');
    });
  });
});
```

### 边界条件测试

必须测试以下边界条件：

- 空值和 null
- 最小值和最大值
- 边界值 (如 999, 1000, 1000000)
- 无效输入
- 特殊字符和格式

## Mock 和异步测试

### Mock 策略

对于依赖外部库的函数，使用 Jest Mock：

```typescript
// Mock 模块
jest.mock('localforage', () => ({
  default: {
    createInstance: jest.fn(),
  },
}));

// Mock 函数
const mockFn = jest.fn();
mockFn.mockReturnValue('result');
mockFn.mockResolvedValue('async-result');
mockFn.mockRejectedValue(new Error('error'));
```

### 异步测试

使用 async/await 测试异步函数：

```typescript
it('应该异步返回结果', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});

it('应该处理异步错误', async () => {
  await expect(asyncFunction()).rejects.toThrow('error');
});
```

### 测试隔离和清理

使用 `beforeEach` 和 `afterEach` 确保测试隔离：

```typescript
describe('测试套件', () => {
  beforeEach(() => {
    // 每个测试前执行
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 每个测试后执行
  });

  it('测试用例 1', () => {});
  it('测试用例 2', () => {});
});
```

## 常见断言方法

```typescript
// 相等性
expect(value).toBe(expected);
expect(value).toEqual(expected);

// 真值
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// 数字
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(0.1);

// 字符串
expect(value).toMatch(/regex/);
expect(value).toContain('substring');

// 数组
expect(array).toHaveLength(3);
expect(array).toContain(item);

// 对象
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// 异常
expect(fn).toThrow();
expect(fn).toThrow('error message');

// Promise
await expect(promise).resolves.toBe('value');
await expect(promise).rejects.toThrow('error');
```

## 最佳实践

1. **测试独立性**: 每个测试应该独立运行,不依赖其他测试
2. **测试可读性**: 使用清晰的测试名称和描述
3. **测试覆盖**: 确保测试覆盖所有主要功能和边界条件
4. **避免测试实现细节**: 测试行为而非实现
5. **保持测试简单**: 一个测试只验证一个行为
6. **使用 Mock 合理**: 只 Mock 外部依赖,不要过度 Mock
7. **定期运行测试**: 在提交代码前运行测试
8. **维护测试**: 随着代码更新同步更新测试

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test formatters.spec.ts

# 监听模式运行测试
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# CI 模式运行测试
pnpm test:ci
```

## 故障排查

### 常见问题

1. **Mock 未生效**: 确保 Mock 在测试文件顶部导入之前声明
2. **异步测试超时**: 增加 Jest 超时时间或检查异步逻辑
3. **类型错误**: 确保 tsconfig.json 包含测试文件
4. **覆盖率不达标**: 检查是否有未测试的分支或条件

### 调试技巧

```typescript
// 只运行特定测试
it.only('应该返回预期结果', () => {});

// 跳过特定测试
it.skip('应该返回预期结果', () => {});

// 打印调试信息
console.log('调试信息:', value);

// 使用 .debug() 查看匹配器详情
expect(value).debug();
```

## 参考资源

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Jest TypeScript 支持](https://kulshekhar.github.io/ts-jest/)
