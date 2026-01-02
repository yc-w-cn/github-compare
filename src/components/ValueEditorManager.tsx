'use client';

import { useAtom } from 'jotai';

import { X } from 'lucide-react';

import {
  customCompareManagerSelectedRepoAtom,
  reposAtom,
  valueEditorOpenAtom,
} from '@/atoms';

import { ValueEditor } from './ValueEditor';

export function ValueEditorManager() {
  const [isOpen, setIsOpen] = useAtom(valueEditorOpenAtom);
  const [selectedRepo, setSelectedRepo] = useAtom(
    customCompareManagerSelectedRepoAtom,
  );
  const [repos] = useAtom(reposAtom);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            值编辑
          </h2>
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                选择仓库
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repos.map((repo) => (
                  <button
                    key={repo.full_name}
                    onClick={() => {
                      setSelectedRepo(repo);
                    }}
                    className={`p-4 text-left border transition-all text-left ${
                      selectedRepo?.full_name === repo.full_name
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    } cursor-pointer`}
                  >
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {repo.full_name}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {repo.description || '无描述'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedRepo && (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  编辑 {selectedRepo.full_name} 的值
                </h3>
                <ValueEditor repo={selectedRepo} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
