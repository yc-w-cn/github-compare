'use client';

import { ReactNode } from 'react';

interface TableHeaderProps {
  children: ReactNode;
  field?: string;
  handleSort?: (field: string) => void;
  renderSortIcon?: (field: string) => ReactNode;
}

export function TableHeader({
  children,
  field,
  handleSort,
  renderSortIcon,
}: TableHeaderProps) {
  const isSortable = field && handleSort && renderSortIcon;

  return (
    <th
      className={`py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide ${
        isSortable
          ? 'text-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
          : 'text-left'
      }`}
      onClick={() => {
        if (isSortable && field) {
          handleSort(field);
        }
      }}
    >
      {children}
      {isSortable && field && renderSortIcon(field)}
    </th>
  );
}
