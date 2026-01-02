import { readFileSync } from 'fs';
import { join } from 'path';

import { CustomCompareManager } from '@/components/CustomCompareManager';
import { Footer } from '@/components/Footer';
import { RepoRow } from '@/components/RepoRow';
import type { GitHubRepo } from '@/lib/github/types';

export default function Home() {
  const dataPath = join(process.cwd(), 'public', 'data', 'meta.json');
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

  const repos: GitHubRepo[] = [];

  for (const repoKey of data.repos) {
    const [owner, repo] = repoKey.split('/');
    const filename = `${owner}-${repo}.json`;
    const repoPath = join(process.cwd(), 'public', 'data', filename);
    const repoData = JSON.parse(readFileSync(repoPath, 'utf-8'));
    repos.push(repoData);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <div className="flex-1 max-w-[1400px] mx-auto px-6 py-12">
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
            GitHub 仓库对比
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            对比不同 GitHub 仓库的关键指标，包括 Stars、Forks、Issues、语言等
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-900 dark:border-zinc-100">
                <th className="py-4 px-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  仓库
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  Stars
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  Forks
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  Issues
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  语言
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  大小
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  更新时间
                </th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo) => (
                <RepoRow key={repo.full_name} repo={repo} />
              ))}
            </tbody>
          </table>
        </div>

        {repos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              暂无数据，请使用脚本获取 GitHub 仓库信息
            </p>
            <code className="block mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              pnpm tsx scripts/fetch-github-data.ts &lt;owner&gt; &lt;repo&gt;
            </code>
          </div>
        )}
      </div>

      <Footer />

      <CustomCompareManager repos={repos} rawRepos={repos} />
    </div>
  );
}
