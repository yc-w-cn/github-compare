'use client';

import { useSetAtom } from 'jotai';

import { Database, Edit, Settings } from 'lucide-react';

import { GitHubIcon } from '@/components/GitHubIcon';
import { IconButton } from '@/components/IconButton';

import {
  customCompareManagerOpenAtom,
  importExportManagerOpenAtom,
  valueEditorOpenAtom,
} from '@/atoms';

export function HeaderActions() {
  const setCustomCompareOpen = useSetAtom(customCompareManagerOpenAtom);
  const setValueEditorOpen = useSetAtom(valueEditorOpenAtom);
  const setImportExportOpen = useSetAtom(importExportManagerOpenAtom);

  return (
    <div className="fixed top-0 right-0 p-6 z-10 flex gap-1">
      <IconButton
        icon={<Database className="w-6 h-6" />}
        title="导入导出"
        onClick={() => {
          setImportExportOpen(true);
        }}
      />
      <IconButton
        icon={<Edit className="w-6 h-6" />}
        title="值编辑"
        onClick={() => {
          setValueEditorOpen(true);
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
