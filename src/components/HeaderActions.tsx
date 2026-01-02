'use client';

import { useAtom, useSetAtom } from 'jotai';

import { Database, Settings } from 'lucide-react';

import { GitHubIcon } from '@/components/GitHubIcon';
import { IconButton } from '@/components/IconButton';
import { Switch } from '@/components/ui/switch';

import {
  customCompareManagerOpenAtom,
  editModeAtom,
  importExportManagerOpenAtom,
} from '@/atoms';

export function HeaderActions() {
  const setCustomCompareOpen = useSetAtom(customCompareManagerOpenAtom);
  const setImportExportOpen = useSetAtom(importExportManagerOpenAtom);
  const [editMode, setEditMode] = useAtom(editModeAtom);

  return (
    <div className="p-6 z-10 flex gap-1 items-center">
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          编辑模式
        </span>
        <Switch checked={editMode} onCheckedChange={setEditMode} />
      </div>
      <IconButton
        icon={<Database className="w-6 h-6" />}
        title="导入导出"
        onClick={() => {
          setImportExportOpen(true);
        }}
      />
      <IconButton
        icon={<Settings className="w-6 h-6" />}
        title="属性管理"
        onClick={() => {
          setCustomCompareOpen(true);
        }}
      />
      <IconButton
        href="https://github.com/yc-w-cn/github-compare"
        target="_blank"
        rel="noopener noreferrer"
        icon={<GitHubIcon className="w-6 h-6" />}
        title="GitHub"
      />
    </div>
  );
}
