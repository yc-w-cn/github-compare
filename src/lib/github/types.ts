export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  license: {
    name: string;
  } | null;
  homepage: string | null;
  visibility: string;
}

export interface DataIndex {
  repos: string[];
  lastUpdated: string;
}
