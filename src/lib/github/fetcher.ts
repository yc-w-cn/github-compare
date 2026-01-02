import { config } from 'dotenv';
import type { GitHubRepo } from './types';

config();

export async function fetchGitHubRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN 环境变量未设置');
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`获取仓库信息失败: ${response.statusText}`);
  }

  return response.json();
}
