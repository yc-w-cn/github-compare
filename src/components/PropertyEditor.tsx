'use client';

import { useEffect, useState } from 'react';

import { GripVertical, Plus, Trash2 } from 'lucide-react';

import {
  addProperty,
  deleteProperty,
  getProperties,
  reorderProperties,
  updateProperty,
} from '@/lib/custom-compare';

import type { CustomProperty, CustomPropertyType } from '@/types';

export function PropertyEditor() {
  const [properties, setProperties] = useState<CustomProperty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    slug: '',
    type: 'text' as CustomPropertyType,
  });

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    const props = await getProperties();
    setProperties(props);
  }

  async function handleAdd() {
    if (!formData.displayName || !formData.slug) return;
    await addProperty(formData.displayName, formData.slug, formData.type);
    setFormData({ displayName: '', slug: '', type: 'text' });
    setShowAddForm(false);
    loadProperties();
  }

  async function handleUpdate(id: string) {
    if (!formData.displayName || !formData.slug) return;
    await updateProperty(id, {
      displayName: formData.displayName,
      slug: formData.slug,
      type: formData.type,
    });
    setEditingId(null);
    setFormData({ displayName: '', slug: '', type: 'text' });
    loadProperties();
  }

  async function handleDelete(id: string) {
    if (confirm('确定要删除这个属性吗？')) {
      await deleteProperty(id);
      loadProperties();
    }
  }

  function handleEdit(property: CustomProperty) {
    setEditingId(property.id);
    setFormData({
      displayName: property.displayName,
      slug: property.slug,
      type: property.type,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          自定义属性
        </h3>
        <button
          onClick={() => {
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加属性
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="显示名称"
            value={formData.displayName}
            onChange={(e) => {
              setFormData({ ...formData, displayName: e.target.value });
            }}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => {
              setFormData({ ...formData, slug: e.target.value });
            }}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          <select
            value={formData.type}
            onChange={(e) => {
              setFormData({
                ...formData,
                type: e.target.value as CustomPropertyType,
              });
            }}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="text">纯文本</option>
            <option value="link">链接</option>
            <option value="arxiv">ArXiv 论文</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              添加
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ displayName: '', slug: '', type: 'text' });
              }}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
          >
            <GripVertical className="w-4 h-4 text-zinc-400 cursor-move" />
            {editingId === property.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => {
                    setFormData({ ...formData, displayName: e.target.value });
                  }}
                  className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                />
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                />
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      type: e.target.value as CustomPropertyType,
                    });
                  }}
                  className="px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                >
                  <option value="text">文本</option>
                  <option value="link">链接</option>
                  <option value="arxiv">论文</option>
                </select>
                <button
                  onClick={() => handleUpdate(property.id)}
                  className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded text-sm hover:bg-zinc-700 dark:hover:bg-zinc-300"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ displayName: '', slug: '', type: 'text' });
                  }}
                  className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700"
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {property.displayName}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-500">
                    {property.slug} · {property.type}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleEdit(property);
                  }}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
