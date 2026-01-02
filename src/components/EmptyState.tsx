export function EmptyState() {
  return (
    <div className="border border-zinc-500 dark:border-zinc-800 p-16 text-center w-full mx-auto">
      <p className="text-zinc-600 dark:text-zinc-400 text-lg">
        暂无数据，请使用脚本获取 GitHub 仓库信息
      </p>
      <code className="block mt-4 text-sm text-zinc-500 dark:text-zinc-500">
        pnpm tsx scripts/fetch-github-data.ts &lt;owner&gt; &lt;repo&gt;
      </code>
    </div>
  );
}
