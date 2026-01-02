export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 dark:border-zinc-100" />
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">加载中...</p>
    </div>
  );
}
