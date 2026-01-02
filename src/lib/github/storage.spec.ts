import { ensureDataDir, saveRepoData, updateIndex } from './storage';
import type { GitHubRepo } from './types';

describe('ensureDataDir', () => {
  it('应该在目录不存在时创建目录', () => {
    const mockMkdirSync = jest.fn();
    jest.doMock('fs', () => ({
      existsSync: jest.fn(() => false),
      mkdirSync: mockMkdirSync,
    }));

    const { ensureDataDir } = require('./storage');
    ensureDataDir();

    expect(mockMkdirSync).toHaveBeenCalledWith(
      expect.any(String),
      { recursive: true },
    );
  });

  it('应该在目录存在时不创建目录', () => {
    const mockMkdirSync = jest.fn();
    jest.doMock('fs', () => ({
      existsSync: jest.fn(() => true),
      mkdirSync: mockMkdirSync,
    }));

    const { ensureDataDir } = require('./storage');
    ensureDataDir();

    expect(mockMkdirSync).not.toHaveBeenCalled();
  });
});

describe('saveRepoData', () => {
  it('应该正确保存仓库数据', () => {
    const mockWriteFileSync = jest.fn();
    jest.doMock('fs', () => ({
      writeFileSync: mockWriteFileSync,
    }));

    const { saveRepoData } = require('./storage');
    const mockRepoData: GitHubRepo = {
      id: 1,
      name: 'test-repo',
      full_name: 'test-owner/test-repo',
      owner: {
        login: 'test-owner',
        avatar_url: 'https://example.com/avatar.png',
      },
      description: '测试仓库',
      language: 'TypeScript',
      stargazers_count: 100,
      watchers_count: 50,
      forks_count: 20,
      open_issues_count: 5,
      subscribers_count: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      pushed_at: '2024-01-03T00:00:00Z',
      size: 1000,
      topics: ['test'],
      license: { name: 'MIT' },
      homepage: null,
      visibility: 'public',
    };

    saveRepoData('test-owner', 'test-repo', mockRepoData);

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining('test-owner-test-repo.json'),
      JSON.stringify(mockRepoData, null, 2),
      'utf-8',
    );
  });
});

describe('updateIndex', () => {
  it('应该创建新的索引文件', () => {
    const mockExistsSync = jest.fn(() => false);
    const mockWriteFileSync = jest.fn();
    jest.doMock('fs', () => ({
      existsSync: mockExistsSync,
      readFileSync: jest.fn(),
      writeFileSync: mockWriteFileSync,
    }));

    const { updateIndex } = require('./storage');
    updateIndex('test-owner/test-repo');

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"repos": ["test-owner/test-repo"]'),
      'utf-8',
    );
  });

  it('应该更新现有索引文件', () => {
    const mockExistsSync = jest.fn(() => true);
    const mockReadFileSync = jest.fn(() =>
      JSON.stringify({
        repos: ['existing/repo'],
        lastUpdated: '2024-01-01T00:00:00Z',
      }),
    );
    const mockWriteFileSync = jest.fn();
    jest.doMock('fs', () => ({
      existsSync: mockExistsSync,
      readFileSync: mockReadFileSync,
      writeFileSync: mockWriteFileSync,
    }));

    const { updateIndex } = require('./storage');
    updateIndex('test-owner/test-repo');

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"repos": ["existing/repo", "test-owner/test-repo"]'),
      'utf-8',
    );
  });

  it('应该避免重复添加相同的仓库', () => {
    const mockExistsSync = jest.fn(() => true);
    const mockReadFileSync = jest.fn(() =>
      JSON.stringify({
        repos: ['test-owner/test-repo'],
        lastUpdated: '2024-01-01T00:00:00Z',
      }),
    );
    const mockWriteFileSync = jest.fn();
    jest.doMock('fs', () => ({
      existsSync: mockExistsSync,
      readFileSync: mockReadFileSync,
      writeFileSync: mockWriteFileSync,
    }));

    const { updateIndex } = require('./storage');
    updateIndex('test-owner/test-repo');

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"repos": ["test-owner/test-repo"]'),
      'utf-8',
    );
  });
});
