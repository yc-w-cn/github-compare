'use client';

import { useEffect, useState } from 'react';

import { ExternalLink, FileText } from 'lucide-react';

import { getProperties } from '@/lib/custom-property';
import { CustomProperty } from '@/lib/custom-property/types';
import { GitHubRepo } from '@/lib/github';
import { getRepoValue, setRepoValue } from '@/lib/repo-value';

interface ValueEditorProps {
  repo: GitHubRepo;
}

export function ValueEditor({ repo }: ValueEditorProps) {
  const [properties, setProperties] = useState<CustomProperty[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo.full_name]);

  async function loadProperties() {
    const props = await getProperties();
    setProperties(props);
    const valueMap: Record<string, string> = {};
    for (const prop of props) {
      const value = await getRepoValue(repo.full_name, prop.id);
      if (value) {
        valueMap[prop.id] = value;
      }
    }
    setValues(valueMap);
  }

  async function handleSave(propertyId: string) {
    await setRepoValue(repo.full_name, propertyId, values[propertyId] || '');
    setEditing({ ...editing, [propertyId]: false });
  }

  function renderValue(property: CustomProperty, value: string) {
    if (!value) return <span className="text-zinc-400">-</span>;

    if (property.type === 'link') {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          {value}
        </a>
      );
    }

    if (property.type === 'arxiv') {
      const arxivId = /arxiv\.org\/abs\/(\d+\.\d+)/.exec(value)?.[1] || value;
      return (
        <a
          href={`https://arxiv.org/abs/${arxivId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FileText className="w-3 h-3" />
          {arxivId}
        </a>
      );
    }

    return <span className="text-zinc-900 dark:text-zinc-100">{value}</span>;
  }

  return (
    <div className="space-y-2">
      {properties.map((property) => (
        <div
          key={property.id}
          className="flex items-start gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              {property.displayName}
            </div>
            {editing[property.id] ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={values[property.id] || ''}
                  onChange={(e) => {
                    setValues({ ...values, [property.id]: e.target.value });
                  }}
                  placeholder={
                    property.type === 'link'
                      ? 'https://...'
                      : property.type === 'arxiv'
                        ? 'https://arxiv.org/abs/...'
                        : '输入值'
                  }
                  className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                />
                <button
                  onClick={() => handleSave(property.id)}
                  className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded text-sm hover:bg-zinc-700 dark:hover:bg-zinc-300"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditing({ ...editing, [property.id]: false });
                  }}
                  className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="text-sm">
                {renderValue(property, values[property.id] || '')}
              </div>
            )}
          </div>
          {!editing[property.id] && (
            <button
              onClick={() => {
                setEditing({ ...editing, [property.id]: true });
              }}
              className="px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              编辑
            </button>
          )}
        </div>
      ))}
      {properties.length === 0 && (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-500">
          暂无自定义属性，请先添加属性
        </div>
      )}
    </div>
  );
}
