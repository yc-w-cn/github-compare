'use client';

import { useAtom } from 'jotai';

import { X } from 'lucide-react';

import { customCompareManagerOpenAtom } from '@/atoms';

import { PropertyEditor } from './PropertyEditor';

export function PropertyEditorManager() {
  const [isOpen, setIsOpen] = useAtom(customCompareManagerOpenAtom);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            属性管理
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
          <PropertyEditor />
        </div>
      </div>
    </div>
  );
}
