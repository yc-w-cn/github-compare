import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { GitHubRepo, DataIndex } from './types';

const DATA_DIR = join(process.cwd(), 'src', 'public', 'data');
const INDEX_FILE = join(DATA_DIR, 'data.json');

export function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveRepoData(
  owner: string,
  repo: string,
  data: GitHubRepo,
): void {
  const filename = `${owner}-${repo}.json`;
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

export function updateIndex(repoKey: string): void {
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
}
