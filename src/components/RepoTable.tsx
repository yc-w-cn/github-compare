import { RepoRow } from '@/components/RepoRow';
import { TableHeader } from '@/components/TableHeader';
import { useCustomProperties } from '@/hooks/use-custom-properties';
import { useSortedRepos } from '@/hooks/use-sorted-repos';
import { GitHubRepo } from '@/lib/github/types';

interface RepoTableProps {
  data: GitHubRepo[];
}

export function RepoTable({ data: repos }: RepoTableProps) {
  const { data: customData } = useCustomProperties(repos);
  const { sortedRepos } = useSortedRepos(repos);

  const customProperties = customData?.properties || [];
  const customValuesMap = customData?.valuesMap || {};

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-zinc-900 dark:border-zinc-100">
            <TableHeader>仓库</TableHeader>
            <TableHeader field="stars">Stars</TableHeader>
            <TableHeader field="forks">Forks</TableHeader>
            <TableHeader field="issues">Issues</TableHeader>
            <TableHeader>语言</TableHeader>
            <TableHeader field="size">大小</TableHeader>
            <TableHeader field="updated_at">更新时间</TableHeader>
            {customProperties.map((property) => (
              <TableHeader key={property.id}>
                {property.displayName}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRepos.map((repo) => (
            <RepoRow
              key={repo.full_name}
              repo={repo}
              customProperties={customProperties}
              customValues={customValuesMap[repo.full_name] || {}}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
