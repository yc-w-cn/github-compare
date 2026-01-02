'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { Footer } from '@/components/Footer';
import { HeaderActions } from '@/components/HeaderActions';
import { ImportExportManager } from '@/components/ImportExportManager';
import { PropertyEditorManager } from '@/components/PropertyEditorManager';
import { RepoRow } from '@/components/RepoRow';
import { ValueEditorManager } from '@/components/ValueEditorManager';
import { useCustomProperties } from '@/hooks/use-custom-properties';
import { useRepos } from '@/hooks/use-github-repos';
import { useSortedRepos } from '@/hooks/use-sorted-repos';

import { reposAtom } from '@/atoms';

export default function Home() {
  const { data: repos = [] } = useRepos();
  const setRepos = useSetAtom(reposAtom);
  const { data: customData } = useCustomProperties(repos);
  const { sortedRepos, handleSort, renderSortIcon } = useSortedRepos(repos);

  useEffect(() => {
    setRepos(repos);
  }, [repos, setRepos]);

  const customProperties = customData?.properties || [];
  const customValuesMap = customData?.valuesMap || {};

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col relative">
      <HeaderActions />

      <div className="flex-1 max-w-[1400px] mx-auto px-6 py-12">
        <header className="mb-16">
          <div>
            <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
              Github Compare
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              对比不同 GitHub 仓库的关键指标，包括 Stars、Forks、Issues、语言等
            </p>
          </div>
        </header>

        {repos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-zinc-100">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                    仓库
                  </th>
                  <th
                    className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      handleSort('stars');
                    }}
                  >
                    Stars{renderSortIcon('stars')}
                  </th>
                  <th
                    className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      handleSort('forks');
                    }}
                  >
                    Forks{renderSortIcon('forks')}
                  </th>
                  <th
                    className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      handleSort('issues');
                    }}
                  >
                    Issues{renderSortIcon('issues')}
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                    语言
                  </th>
                  <th
                    className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      handleSort('size');
                    }}
                  >
                    大小{renderSortIcon('size')}
                  </th>
                  <th
                    className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      handleSort('updated_at');
                    }}
                  >
                    更新时间{renderSortIcon('updated_at')}
                  </th>
                  {customProperties.map((property) => (
                    <th
                      key={property.id}
                      className="py-4 px-4 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide"
                    >
                      {property.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRepos.map((repo) => (
                  <RepoRow
                    key={repo.full_name}
                    repo={repo}
                    customProperties={customProperties}
                    customValues={customValuesMap[repo.full_name] || {}}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-zinc-500 dark:border-zinc-800 p-16 text-center max-w-3xl mx-auto">
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

      <PropertyEditorManager />
      <ValueEditorManager />
      <ImportExportManager />
    </div>
  );
}
