import { RepoCustomValue } from '../repo-value/types';

export type CustomPropertyType = 'link' | 'arxiv' | 'text';

export interface CustomProperty {
  id: string;
  displayName: string;
  slug: string;
  order: number;
  type: CustomPropertyType;
}

export interface CustomPropertyData {
  properties: CustomProperty[];
  values: RepoCustomValue[];
}
