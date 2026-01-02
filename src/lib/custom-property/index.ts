import { getData, setData } from '@/lib/storage';

import type { CustomProperty, CustomPropertyType } from './types';

export async function getProperties(): Promise<CustomProperty[]> {
  const data = await getData();
  return data.properties.sort((a, b) => a.order - b.order);
}

export async function addProperty(
  displayName: string,
  slug: string,
  type: CustomPropertyType,
): Promise<CustomProperty> {
  const data = await getData();
  const maxOrder = data.properties.reduce(
    (max, p) => Math.max(max, p.order),
    -1,
  );
  const newProperty: CustomProperty = {
    id: `prop-${Date.now()}`,
    displayName,
    slug,
    type,
    order: maxOrder + 1,
  };
  data.properties.push(newProperty);
  await setData(data);
  return newProperty;
}

export async function updateProperty(
  id: string,
  updates: Partial<CustomProperty>,
): Promise<void> {
  const data = await getData();
  const index = data.properties.findIndex((p) => p.id === id);
  if (index !== -1) {
    data.properties[index] = { ...data.properties[index], ...updates };
    await setData(data);
  }
}

export async function deleteProperty(id: string): Promise<void> {
  const data = await getData();
  data.properties = data.properties.filter((p) => p.id !== id);
  data.values = data.values.filter((v) => v.propertyId !== id);
  await setData(data);
}

export async function reorderProperties(propertyIds: string[]): Promise<void> {
  const data = await getData();
  const propertyMap = new Map(data.properties.map((p) => [p.id, p]));
  data.properties = propertyIds
    .map((id, order) => {
      const prop = propertyMap.get(id);
      return prop ? { ...prop, order } : null;
    })
    .filter((p): p is CustomProperty => p !== null);
  await setData(data);
}
