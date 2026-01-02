import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Providers } from '@/components/Providers';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Github Compare - GitHub 仓库对比工具',
    template: '%s | Github Compare',
  },
  description:
    '对比不同 GitHub 仓库的关键指标，包括 Stars、Forks、Issues、语言等。快速了解和比较多个开源项目的活跃度和影响力。',
  keywords: [
    'GitHub',
    '仓库对比',
    '开源项目',
    'Stars对比',
    'Forks对比',
    'GitHub统计',
    '开源项目分析',
  ],
  authors: [{ name: 'YC-W-CN' }],
  creator: 'YC-W-CN',
  publisher: 'YC-W-CN',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yc-w-cn.github.io/github-compare/',
    title: 'Github Compare - GitHub 仓库对比工具',
    description:
      '对比不同 GitHub 仓库的关键指标，包括 Stars、Forks、Issues、语言等',
    siteName: 'Github Compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Github Compare - GitHub 仓库对比工具',
    description:
      '对比不同 GitHub 仓库的关键指标，包括 Stars、Forks、Issues、语言等',
    creator: 'Yuchen Wang',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(geistSans.variable, geistMono.variable, 'antialiased')}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
