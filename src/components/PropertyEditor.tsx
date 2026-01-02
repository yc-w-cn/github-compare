'use client';

import { useEffect, useState } from 'react';

import { GripVertical, Trash2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  addProperty,
  deleteProperty,
  getProperties,
  updateProperty,
} from '@/lib/custom-property';
import {
  CustomProperty,
  CustomPropertyType,
} from '@/lib/custom-property/types';

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
    void loadProperties();
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
    await loadProperties();
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
    await loadProperties();
  }

  async function handleDelete(id: string) {
    if (confirm('确定要删除这个属性吗？')) {
      await deleteProperty(id);
      await loadProperties();
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
    <div className="space-y-6">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              显示名称
            </label>
            <input
              type="text"
              placeholder="输入名称"
              value={formData.displayName}
              onChange={(e) => {
                setFormData({ ...formData, displayName: e.target.value });
              }}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              英文名称
            </label>
            <input
              type="text"
              placeholder="输入英文标识"
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value });
              }}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              属性类型
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData({ ...formData, type: value as CustomPropertyType });
              }}
            >
              <SelectTrigger className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-10.5!">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text" className="h-10 cursor-pointer">
                  纯文本
                </SelectItem>
                <SelectItem value="link" className="h-10 cursor-pointer">
                  链接
                </SelectItem>
                <SelectItem value="arxiv" className="h-10 cursor-pointer">
                  ArXiv
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <button
              onClick={handleAdd}
              disabled={!formData.displayName || !formData.slug}
              className="w-full px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium transition-all hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
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
                  className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                />
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                  }}
                  className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                />
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      type: value as CustomPropertyType,
                    });
                  }}
                >
                  <SelectTrigger className="w-32 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">文本</SelectItem>
                    <SelectItem value="link">链接</SelectItem>
                    <SelectItem value="arxiv">论文</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => handleUpdate(property.id)}
                  className="px-4 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium transition-all hover:bg-zinc-700 dark:hover:bg-zinc-300 cursor-pointer"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ displayName: '', slug: '', type: 'text' });
                  }}
                  className="px-4 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium border border-zinc-300 dark:border-zinc-700 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
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
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
