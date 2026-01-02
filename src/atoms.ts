import { atom } from 'jotai';

import type { GitHubRepo } from '@/lib/github/types';

export const reposAtom = atom<GitHubRepo[]>([]);

export const customCompareManagerOpenAtom = atom(false);

export const valueEditorOpenAtom = atom(false);

export const importExportManagerOpenAtom = atom(false);

export const customCompareManagerSelectedRepoAtom = atom<GitHubRepo | null>(
  null,
);
