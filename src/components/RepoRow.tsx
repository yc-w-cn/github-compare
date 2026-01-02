import type { GitHubRepo } from '@/lib/github';
import { formatDate, formatNumber, formatSize } from '@/lib/utils';

interface RepoRowProps {
  repo: GitHubRepo;
}

export function RepoRow({ repo }: RepoRowProps) {
  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <a
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            {repo.full_name}
          </a>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
          {repo.description || '无描述'}
        </p>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="inline-flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
          ★ {formatNumber(repo.stargazers_count)}
        </span>
      </td>
      <td className="py-4 px-4 text-center text-zinc-900 dark:text-zinc-100">
        {formatNumber(repo.forks_count)}
      </td>
      <td className="py-4 px-4 text-center text-zinc-900 dark:text-zinc-100">
        {repo.open_issues_count}
      </td>
      <td className="py-4 px-4 text-center">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-zinc-900 dark:text-zinc-100">
            {repo.language || '未知'}
          </span>
        </span>
      </td>
      <td className="py-4 px-4 text-center text-zinc-600 dark:text-zinc-400 text-sm">
        {formatSize(repo.size)}
      </td>
      <td className="py-4 px-4 text-center text-zinc-600 dark:text-zinc-400 text-sm">
        {formatDate(repo.updated_at)}
      </td>
    </tr>
  );
}
