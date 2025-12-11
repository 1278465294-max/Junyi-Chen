export interface CountryData {
  id: string;
  name: string;
  region: string;
  electricity: number; // 0-100%
  connectivity: number; // 0-100% (4G)
  gap: number; // electricity - connectivity
  population: number; // In millions (Visual: Size)
  gdp: number; // Per capita in k USD (Visual: Opacity/Brightness)
}

export enum ViewMode {
  REPORT = 'REPORT', // New Story/Presentation Mode
  TEETER = 'TEETER',
  CONSTELLATION = 'CONSTELLATION',
  LANES = 'LANES',
  VEO_STUDIO = 'VEO_STUDIO'
}

export interface VisualizationConfig {
  showLabels: boolean;
  showGrid: boolean;
  accentColor: 'cyan' | 'magenta' | 'blue';
}

export const REGIONS = [
  'North America',
  'Europe & Central Asia',
  'East Asia & Pacific',
  'Latin America & Caribbean',
  'Middle East & North Africa',
  'South Asia',
  'Sub-Saharan Africa'
];