import { atom } from 'jotai';

import type { GitHubRepo } from '@/lib/github/types';

export const reposAtom = atom<GitHubRepo[]>([]);

export const customCompareManagerOpenAtom = atom(false);

export const valueEditorOpenAtom = atom(false);

export const importExportManagerOpenAtom = atom(false);

export const customCompareManagerSelectedRepoAtom = atom<GitHubRepo | null>(
  null,
);

export type SortField = 'stars' | 'forks' | 'issues' | 'updated_at' | 'size';
export type SortOrder = 'asc' | 'desc';

export const sortFieldAtom = atom<SortField>('stars');
export const sortOrderAtom = atom<SortOrder>('desc');

export const editModeAtom = atom(false);
