'use client';

import { useRef, useState } from 'react';

import { Download, Trash2, Upload } from 'lucide-react';

import { GitHubRepo } from '@/lib/github/types';
import { exportData, importData } from '@/lib/import-export';
import type { ExportData } from '@/lib/import-export/types';
import { clearAllData } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface ImportExportPanelProps {
  repos: GitHubRepo[];
  onDataImported?: () => void;
}

export function ImportExportPanel({
  repos,
  onDataImported,
}: ImportExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    try {
      setIsExporting(true);
      const data = await exportData(repos);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `github-compare-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: '导出成功' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '导出失败' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      if (!data.customData) {
        throw new Error('无效的文件格式');
      }

      const result = await importData(data);
      setMessage({
        type: 'success',
        text: `导入成功：${result.propertiesCount} 个属性，${result.valuesCount} 个值`,
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      onDataImported?.();
    } catch (error) {
      setMessage({ type: 'error', text: '导入失败：文件格式错误' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleClear() {
    if (confirm('确定要清空所有自定义对比数据吗？此操作不可恢复。')) {
      try {
        await clearAllData();
        setMessage({ type: 'success', text: '数据已清空' });
        setTimeout(() => {
          setMessage(null);
        }, 3000);
        onDataImported?.();
      } catch (error) {
        setMessage({ type: 'error', text: '清空失败' });
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={cn(
            'p-4 border-l-4',
            message.type === 'success'
              ? 'bg-zinc-50 dark:bg-zinc-900/30 border-green-900 dark:border-green-400 text-zinc-900 dark:text-zinc-100'
              : 'bg-zinc-50 dark:bg-zinc-900/30 border-red-900 dark:border-red-400 text-zinc-900 dark:text-zinc-100',
          )}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting || repos.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 dark:hover:bg-zinc-300 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isExporting ? '导出中...' : '导出数据'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          {isImporting ? '导入中...' : '导入数据'}
        </button>

        <button
          onClick={handleClear}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium border border-zinc-300 dark:border-zinc-700 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          清空数据
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          导出数据包含
        </h4>
        <div className="grid grid-cols-3 gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 flex-shrink-0" />
            <span>仓库元信息</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 flex-shrink-0" />
            <span>自定义属性定义</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 flex-shrink-0" />
            <span>仓库自定义值</span>
          </div>
        </div>
      </div>
    </div>
  );
}
