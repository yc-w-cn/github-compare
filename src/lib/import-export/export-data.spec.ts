import { getData } from '@/lib/storage';

import { GitHubRepo } from '../github';
import { exportData } from './export-data';

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
}));

describe('export-data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该导出包含仓库和自定义数据', async () => {
    const mockData = { properties: [], values: [] };
    (getData as jest.Mock).mockResolvedValue(mockData);

    const repos: GitHubRepo[] = [
      {
        id: 1,
        name: 'test',
        full_name: 'owner/test',
        owner: { login: 'owner', avatar_url: '' },
        description: null,
        language: null,
        stargazers_count: 0,
        watchers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        subscribers_count: 0,
        created_at: '',
        updated_at: '',
        pushed_at: '',
        size: 0,
        topics: [],
        license: null,
        homepage: null,
        visibility: 'public',
      },
    ];

    const result = await exportData(repos);

    expect(result.repos).toEqual(repos);
    expect(result.customData).toEqual(mockData);
  });
});
