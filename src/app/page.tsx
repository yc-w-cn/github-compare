'use client';

import { EmptyState } from '@/components/EmptyState';
import { Footer } from '@/components/Footer';
import { HeaderActions } from '@/components/HeaderActions';
import { ImportExportManager } from '@/components/ImportExportManager';
import { PropertyEditorManager } from '@/components/PropertyEditorManager';
import { RepoTable } from '@/components/RepoTable';
import { ValueEditorManager } from '@/components/ValueEditorManager';
import { useRepos } from '@/hooks/use-github-repos';

export default function Home() {
  const { data: repos = [] } = useRepos();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col relative">
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col">
        <header className="mb-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Github Compare
          </h1>
          <HeaderActions />
        </header>

        <div className="w-full flex-1 flex items-center justify-center">
          {repos.length > 0 ? <RepoTable data={repos} /> : <EmptyState />}
        </div>
      </div>

      <Footer />

      <PropertyEditorManager />
      <ValueEditorManager />
      <ImportExportManager />
    </div>
  );
}
