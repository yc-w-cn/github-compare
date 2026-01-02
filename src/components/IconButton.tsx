'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  title?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export function IconButton({
  icon,
  title,
  href,
  target,
  rel,
  className,
  ...props
}: IconButtonProps) {
  const baseClassName = cn(
    'w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer',
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClassName}
        title={title}
      >
        {icon}
      </a>
    );
  }

  return (
    <button className={baseClassName} title={title} {...props}>
      {icon}
    </button>
  );
}
