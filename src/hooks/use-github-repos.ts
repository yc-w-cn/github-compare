import { useQuery } from '@tanstack/react-query';

import type { GitHubRepo } from '@/lib/github/types';

async function fetchRepos(): Promise<GitHubRepo[]> {
  const metaResponse = await fetch('/github-compare/data/meta.json');
  const meta = await metaResponse.json();

  const reposData: GitHubRepo[] = [];
  for (const repoKey of meta.repos) {
    const [owner, repo] = repoKey.split('/');
    const filename = `${owner}-${repo}.json`;
    const repoResponse = await fetch(`/github-compare/data/${filename}`);
    const repoData = await repoResponse.json();
    reposData.push(repoData);
  }

  return reposData;
}

export function useRepos() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: fetchRepos,
  });
}
