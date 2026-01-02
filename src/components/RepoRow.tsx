import { ExternalLink, FileText } from 'lucide-react';

import type { CustomProperty } from '@/lib/custom-property/types';
import type { GitHubRepo } from '@/lib/github';
import { formatDate, formatNumber, formatSize } from '@/lib/utils';

interface RepoRowProps {
  repo: GitHubRepo;
  customProperties: CustomProperty[];
  customValues: Record<string, string>;
}

export function RepoRow({
  repo,
  customProperties,
  customValues,
}: RepoRowProps) {
  function renderCustomValue(property: CustomProperty, value: string) {
    if (!value) return <span className="text-zinc-400">-</span>;

    if (property.type === 'link') {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          {value}
        </a>
      );
    }

    if (property.type === 'arxiv') {
      const arxivId = /arxiv\.org\/abs\/(\d+\.\d+)/.exec(value)?.[1] || value;
      return (
        <a
          href={`https://arxiv.org/abs/${arxivId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FileText className="w-3 h-3" />
          {arxivId}
        </a>
      );
    }

    return <span className="text-zinc-900 dark:text-zinc-100">{value}</span>;
  }

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
      <td className="py-4 px-4 text-center text-zinc-900 dark:text-zinc-100">
        {repo.language || '未知'}
      </td>
      <td className="py-4 px-4 text-center text-zinc-600 dark:text-zinc-400 text-sm">
        {formatSize(repo.size)}
      </td>
      <td className="py-4 px-4 text-center text-zinc-600 dark:text-zinc-400 text-sm">
        {formatDate(repo.updated_at)}
      </td>
      {customProperties.map((property) => (
        <td key={property.id} className="py-4 px-4 text-center text-sm">
          {renderCustomValue(property, customValues[property.id] || '')}
        </td>
      ))}
    </tr>
  );
}
