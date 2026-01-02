import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { GitHubRepo } from '@/lib/github/types';

import { sortFieldAtom, sortOrderAtom } from '@/atoms';

export function useSortedRepos(repos: GitHubRepo[]) {
  const sortField = useAtomValue(sortFieldAtom);
  const sortOrder = useAtomValue(sortOrderAtom);

  const sortedRepos = useMemo(() => {
    const sorted = [...repos];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'stars':
          comparison = a.stargazers_count - b.stargazers_count;
          break;
        case 'forks':
          comparison = a.forks_count - b.forks_count;
          break;
        case 'issues':
          comparison = a.open_issues_count - b.open_issues_count;
          break;
        case 'updated_at':
          comparison =
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [repos, sortField, sortOrder]);

  return {
    sortedRepos,
  };
}
