'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import type { RepoDisplayData, GitHubRepo } from '@/types';
import { PropertyEditor } from './PropertyEditor';
import { ValueEditor } from './ValueEditor';
import { ImportExportPanel } from './ImportExportPanel';

interface CustomCompareManagerProps {
  repos: RepoDisplayData[];
  rawRepos: GitHubRepo[];
}

export function CustomCompareManager({ repos, rawRepos }: CustomCompareManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepoDisplayData | null>(null);
  const [activeTab, setActiveTab] = useState<'properties' | 'values' | 'import-export'>('properties');

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        title="自定义对比"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            自定义对比
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'properties'
                ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            属性管理
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'values'
                ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            值编辑
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'import-export'
                ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            导入导出
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'properties' && <PropertyEditor />}

          {activeTab === 'values' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  选择仓库
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {repos.map((repo) => (
                    <button
                      key={repo.fullName}
                      onClick={() => setSelectedRepo(repo)}
                      className={`p-4 text-left border rounded-lg transition-colors ${
                        selectedRepo?.fullName === repo.fullName
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {repo.fullName}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {repo.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedRepo && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    编辑 {selectedRepo.fullName} 的值
                  </h3>
                  <ValueEditor repo={selectedRepo} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'import-export' && (
            <ImportExportPanel repos={rawRepos} onDataImported={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}
