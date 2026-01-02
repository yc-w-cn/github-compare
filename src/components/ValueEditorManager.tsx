'use client';

import { useAtom, useSetAtom } from 'jotai';

import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import type { CustomProperty } from '@/lib/custom-property/types';
import type { GitHubRepo } from '@/lib/github/types';
import { setRepoValue } from '@/lib/repo-value';

import {
  valueEditorOpenAtom,
  valueEditorPropertyAtom,
  valueEditorRepoAtom,
  valueEditorValueAtom,
} from '@/atoms';

export function ValueEditorManager() {
  const [isOpen, setIsOpen] = useAtom(valueEditorOpenAtom);
  const [repo] = useAtom(valueEditorRepoAtom);
  const [property] = useAtom(valueEditorPropertyAtom);
  const [value, setValue] = useAtom(valueEditorValueAtom);
  const queryClient = useQueryClient();

  async function handleSave() {
    if (repo && property) {
      await setRepoValue(repo.full_name, property.id, value);
      queryClient.invalidateQueries({ queryKey: ['custom-properties'] });
    }
    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  if (!isOpen || !repo || !property) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            编辑值
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder={
                property.type === 'link'
                  ? 'https://...'
                  : property.type === 'arxiv'
                    ? 'https://arxiv.org/abs/...'
                    : '输入值'
              }
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
