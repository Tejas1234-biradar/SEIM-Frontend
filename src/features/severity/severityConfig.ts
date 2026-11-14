import type { SeverityBandConfig, SeverityLevel } from '../../api/types';

export interface SeverityConfig {
  baseMagnitude: number;
  minMagnitude: number;
  maxMagnitude: number;
  defaultMagnitude: number;
  bands: SeverityBandConfig[];
}

export const DEFAULT_SEVERITY_CONFIG: SeverityConfig = {
  baseMagnitude: 5.0,
  minMagnitude: 1.0,
  maxMagnitude: 9.5,
  defaultMagnitude: 5.5,
  bands: [
    {
      name: 'Severe',
      maxDistanceKm: 5.0,
      color: '#d32f2f', // Vermilion / Red (colorblind safe)
      textColor: '#ffffff',
      description: 'Critical structural risk & high ground motion (0–5 km)',
    },
    {
      name: 'High',
      maxDistanceKm: 15.0,
      color: '#ea580c', // Bright Orange
      textColor: '#ffffff',
      description: 'Significant damage potential & strong shaking (5–15 km)',
    },
    {
      name: 'Moderate',
      maxDistanceKm: 40.0,
      color: '#eab308', // Amber / Gold
      textColor: '#1e293b',
      description: 'Moderate shaking, light non-structural damage (15–40 km)',
    },
    {
      name: 'Low',
      maxDistanceKm: 100.0,
      color: '#0284c7', // Sky / Cyan
      textColor: '#ffffff',
      description: 'Felt shaking, negligible structural risk (40–100 km)',
    },
  ],
};

export const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string; border: string }> = {
  Severe: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
  High: { bg: '#ffedd5', text: '#9a3412', border: '#f97316' },
  Moderate: { bg: '#fef9c3', text: '#854d0e', border: '#eab308' },
  Low: { bg: '#e0f2fe', text: '#075985', border: '#0284c7' },
  None: { bg: '#f1f5f9', text: '#475569', border: '#94a3b8' },
};
