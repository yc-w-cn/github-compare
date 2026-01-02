'use client';

import { useRef, useState } from 'react';

import { Download, Trash2, Upload } from 'lucide-react';

import { GitHubRepo } from '@/lib/github/types';
import { exportData, importData } from '@/lib/import-export';
import type { ExportData } from '@/lib/import-export/types';
import { clearAllData } from '@/lib/storage';

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        导入导出
      </h3>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting || repos.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {isExporting ? '导出中...' : '导出数据'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {isImporting ? '导入中...' : '导入数据'}
        </button>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
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

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>导出的数据包含：</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>所有仓库的元信息</li>
          <li>自定义属性定义</li>
          <li>每个仓库的自定义值</li>
        </ul>
      </div>
    </div>
  );
}
