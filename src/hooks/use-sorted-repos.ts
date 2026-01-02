import { useMemo, useState } from 'react';

import type { GitHubRepo } from '@/lib/github/types';

type SortField = 'stars' | 'forks' | 'issues' | 'updated_at' | 'size';
type SortOrder = 'asc' | 'desc';

export function useSortedRepos(repos: GitHubRepo[]) {
  const [sortField, setSortField] = useState<SortField>('stars');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return {
    sortedRepos,
    sortField,
    sortOrder,
    handleSort,
    renderSortIcon,
  };
}
