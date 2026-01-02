import { CustomPropertyData } from '../custom-property/types';
import { GitHubRepo } from '../github/types';

export interface ExportData {
  exportedAt: string;
  repos: GitHubRepo[];
  customData: CustomPropertyData;
}
