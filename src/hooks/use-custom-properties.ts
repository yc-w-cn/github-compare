import { useQuery } from '@tanstack/react-query';

import { getProperties } from '@/lib/custom-property';
import type { GitHubRepo } from '@/lib/github/types';
import { getRepoValues } from '@/lib/repo-value';

async function fetchCustomData(repos: GitHubRepo[]) {
  const props = await getProperties();

  const valuesMap: Record<string, Record<string, string>> = {};
  for (const repo of repos) {
    const values = await getRepoValues(repo.full_name);
    valuesMap[repo.full_name] = {};
    for (const value of values) {
      valuesMap[repo.full_name][value.propertyId] = value.value;
    }
  }

  return { properties: props, valuesMap };
}

export function useCustomProperties(repos: GitHubRepo[]) {
  return useQuery({
    queryKey: ['custom-properties', repos.map((r) => r.full_name).join(',')],
    queryFn: () => fetchCustomData(repos),
    enabled: repos.length > 0,
  });
}
