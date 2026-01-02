// 安装依赖: pnpm add dayjs

import dayjs from 'dayjs';

export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '未知版本';
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || '';

  const formattedDate = buildDate ? dayjs(buildDate).format('YYYY-MM-DD') : '';

  return (
    <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500">
        <p>版本: {version}</p>
        <p>编译日期: {formattedDate}</p>
      </div>
    </footer>
  );
}
