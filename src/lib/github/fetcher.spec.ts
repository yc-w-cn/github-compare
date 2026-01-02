import { fetchGitHubRepo } from './fetcher';
import type { GitHubRepo } from './types';

describe('fetchGitHubRepo', () => {
  const mockToken = 'test-token';
  const mockOwner = 'test-owner';
  const mockRepo = 'test-repo';

  beforeEach(() => {
    process.env.GITHUB_TOKEN = mockToken;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
    jest.restoreAllMocks();
  });

  it('应该成功获取仓库信息', async () => {
    const mockRepoData: GitHubRepo = {
      id: 1,
      name: mockRepo,
      full_name: `${mockOwner}/${mockRepo}`,
      owner: {
        login: mockOwner,
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
      topics: ['test', 'typescript'],
      license: { name: 'MIT' },
      homepage: 'https://example.com',
      visibility: 'public',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepoData,
    });

    const result = await fetchGitHubRepo(mockOwner, mockRepo);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockOwner}/${mockRepo}`,
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );
    expect(result).toEqual(mockRepoData);
  });

  it('应该在 GITHUB_TOKEN 未设置时抛出错误', async () => {
    delete process.env.GITHUB_TOKEN;

    await expect(fetchGitHubRepo(mockOwner, mockRepo)).rejects.toThrow(
      'GITHUB_TOKEN 环境变量未设置',
    );
  });

  it('应该在 API 请求失败时抛出错误', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchGitHubRepo(mockOwner, mockRepo)).rejects.toThrow(
      '获取仓库信息失败: Not Found',
    );
  });
});
