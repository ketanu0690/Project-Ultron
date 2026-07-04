import type { DistrictId } from './district';

export interface DistrictThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
}

export interface District {
  id: string;
  slug: DistrictId;
  name: string;
  themeConfig: DistrictThemeConfig;
  agentCount: number;
  metrics?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
