import localforage from 'localforage';

import { CustomPropertyData } from '../custom-property/types';

const STORAGE_KEY = 'custom-compare-data';
const store = localforage.createInstance({
  name: 'github-compare',
  storeName: 'custom-compare',
});

export async function getData(): Promise<CustomPropertyData> {
  const data = await store.getItem<CustomPropertyData>(STORAGE_KEY);
  return data || { properties: [], values: [] };
}

export async function setData(data: CustomPropertyData): Promise<void> {
  await store.setItem(STORAGE_KEY, data);
}

export async function clearAllData(): Promise<void> {
  await store.removeItem(STORAGE_KEY);
}
