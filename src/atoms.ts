import { atom } from 'jotai';

import type { GitHubRepo } from '@/lib/github/types';

export type CustomCompareManagerTab = 'properties' | 'values' | 'import-export';

export const reposAtom = atom<GitHubRepo[]>([]);

export const customCompareManagerOpenAtom = atom(false);

export const customCompareManagerSelectedRepoAtom = atom<GitHubRepo | null>(
  null,
);

export const customCompareManagerActiveTabAtom =
  atom<CustomCompareManagerTab>('properties');
