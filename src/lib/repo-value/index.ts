import { getData, setData } from '@/lib/storage';

import type { RepoCustomValue } from './types';

export async function getRepoValue(
  repoFullName: string,
  propertyId: string,
): Promise<string | null> {
  const data = await getData();
  const value = data.values.find(
    (v) => v.repoFullName === repoFullName && v.propertyId === propertyId,
  );
  return value?.value || null;
}

export async function setRepoValue(
  repoFullName: string,
  propertyId: string,
  value: string,
): Promise<void> {
  const data = await getData();
  const index = data.values.findIndex(
    (v) => v.repoFullName === repoFullName && v.propertyId === propertyId,
  );
  if (index !== -1) {
    data.values[index].value = value;
  } else {
    data.values.push({ repoFullName, propertyId, value });
  }
  await setData(data);
}

export async function getRepoValues(
  repoFullName: string,
): Promise<RepoCustomValue[]> {
  const data = await getData();
  return data.values.filter((v) => v.repoFullName === repoFullName);
}
