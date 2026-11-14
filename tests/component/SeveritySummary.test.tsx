import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeveritySummary } from '@/features/severity/SeveritySummary';
import type { SeveritySummaryStats } from '@/api/types';

describe('SeveritySummary Component', () => {
  const dummyStats: SeveritySummaryStats = {
    totalBuildings: 10,
    totalSensors: 4,
    countsBySeverity: {
      Severe: 3,
      High: 4,
      Moderate: 2,
      Low: 1,
      None: 0,
    },
    nearestBuilding: {
      entity: {
        id: 'b1',
        name: 'Alpha Tower',
        position: { x: 0, y: 0, z: 0, lat: 12.98, lon: 77.60 },
        properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3 },
      },
      distanceKm: 1.25,
      severity: 'Severe',
    },
    farthestBuilding: {
      entity: {
        id: 'b2',
        name: 'Omega Block',
        position: { x: 0, y: 0, z: 0, lat: 13.50, lon: 77.60 },
        properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3 },
      },
      distanceKm: 58.4,
      severity: 'Low',
    },
  };

  it('renders structural risk counts accurately', () => {
    render(<SeveritySummary summary={dummyStats} hasEpicenter={true} />);

    expect(screen.getByText('Structural Impact Summary')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Severe
    expect(screen.getByText('4')).toBeInTheDocument(); // High
    expect(screen.getByText('2')).toBeInTheDocument(); // Moderate
    expect(screen.getByText('1')).toBeInTheDocument(); // Low

    expect(screen.getByText('Alpha Tower')).toBeInTheDocument();
    expect(screen.getByText('1.25 km')).toBeInTheDocument();
    expect(screen.getByText('Omega Block')).toBeInTheDocument();
    expect(screen.getByText('58.4 km')).toBeInTheDocument();
  });

  it('displays placeholder message when no epicenter is active', () => {
    render(<SeveritySummary summary={dummyStats} hasEpicenter={false} />);
    expect(screen.getByText(/No active earthquake epicenter set/i)).toBeInTheDocument();
  });
});
