import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  license: {
    name: string;
  } | null;
  homepage: string | null;
  visibility: string;
}

interface DataIndex {
  repos: string[];
  lastUpdated: string;
}

const DATA_DIR = join(process.cwd(), 'src', 'public', 'data');
const INDEX_FILE = join(DATA_DIR, 'data.json');

async function fetchGitHubRepo(
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

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function saveRepoData(owner: string, repo: string, data: GitHubRepo): void {
  const filename = `${owner}-${repo}.json`;
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`已保存: ${filepath}`);
}

function updateIndex(repoKey: string): void {
  let index: DataIndex;

  if (existsSync(INDEX_FILE)) {
    index = JSON.parse(readFileSync(INDEX_FILE, 'utf-8'));
  } else {
    index = { repos: [], lastUpdated: '' };
  }

  if (!index.repos.includes(repoKey)) {
    index.repos.push(repoKey);
  }

  index.lastUpdated = new Date().toISOString();
  writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`已更新索引: ${INDEX_FILE}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      '使用方法: pnpm tsx scripts/fetch-github-data.ts <owner> <repo>',
    );
    process.exit(1);
  }

  const [owner, repo] = args;
  const repoKey = `${owner}/${repo}`;

  console.log(`正在获取 ${repoKey} 的信息...`);

  ensureDataDir();

  try {
    const repoData = await fetchGitHubRepo(owner, repo);
    saveRepoData(owner, repo, repoData);
    updateIndex(repoKey);
    console.log(`✅ 成功获取 ${repoKey} 的信息`);
  } catch (error) {
    console.error(
      `❌ 错误: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main();
