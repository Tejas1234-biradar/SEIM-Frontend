import { describe, it, expect } from 'vitest';
import {
  severityFor,
  getScaledBands,
  estimatePgaG,
  evaluateEntities,
  computeSeveritySummary,
} from '@/features/severity/severityEngine';
import { DEFAULT_SEVERITY_CONFIG } from '@/features/severity/severityConfig';
import type { Building, Sensor } from '@/api/types';

describe('severityEngine - severityFor', () => {
  it('returns Severe for distance <= 5 km at baseline magnitude 5.0', () => {
    expect(severityFor(0, 5.0)).toBe('Severe');
    expect(severityFor(2.5, 5.0)).toBe('Severe');
    expect(severityFor(5.0, 5.0)).toBe('Severe');
  });

  it('returns High for distance between 5.1 and 15 km at baseline magnitude 5.0', () => {
    expect(severityFor(5.1, 5.0)).toBe('High');
    expect(severityFor(10.0, 5.0)).toBe('High');
    expect(severityFor(15.0, 5.0)).toBe('High');
  });

  it('returns Moderate for distance between 15.1 and 40 km at baseline magnitude 5.0', () => {
    expect(severityFor(15.1, 5.0)).toBe('Moderate');
    expect(severityFor(25.0, 5.0)).toBe('Moderate');
    expect(severityFor(40.0, 5.0)).toBe('Moderate');
  });

  it('returns Low for distance between 40.1 and 100 km at baseline magnitude 5.0', () => {
    expect(severityFor(40.1, 5.0)).toBe('Low');
    expect(severityFor(75.0, 5.0)).toBe('Low');
    expect(severityFor(100.0, 5.0)).toBe('Low');
  });

  it('returns None for distance > 100 km at baseline magnitude 5.0', () => {
    expect(severityFor(100.1, 5.0)).toBe('None');
    expect(severityFor(250.0, 5.0)).toBe('None');
  });

  it('scales bands up for higher magnitude (e.g. M7.0)', () => {
    const scaledBandsM7 = getScaledBands(7.0);
    // Severe band at M7 should be wider than at M5
    const severeM7 = scaledBandsM7.find((b) => b.name === 'Severe')!;
    const severeM5 = DEFAULT_SEVERITY_CONFIG.bands.find((b) => b.name === 'Severe')!;
    expect(severeM7.maxDistanceKm).toBeGreaterThan(severeM5.maxDistanceKm);

    // At 12 km, M5 is High, but M7 should be Severe!
    expect(severityFor(12, 5.0)).toBe('High');
    expect(severityFor(12, 7.0)).toBe('Severe');
  });

  it('throws error for invalid distance or magnitude', () => {
    expect(() => severityFor(-1, 5.0)).toThrow();
    expect(() => severityFor(10, -1)).toThrow();
    expect(() => severityFor(NaN, 5.0)).toThrow();
  });
});

describe('estimatePgaG', () => {
  it('estimates sensible PGA values (higher close, lower far)', () => {
    const closePga = estimatePgaG(1.0, 6.5);
    const farPga = estimatePgaG(50.0, 6.5);
    expect(closePga).toBeGreaterThan(farPga);
    expect(closePga).toBeGreaterThan(0.1);
    expect(farPga).toBeLessThan(closePga);
  });
});

describe('evaluateEntities and computeSeveritySummary', () => {
  const dummyBuildings: Building[] = [
    {
      id: 'b1',
      name: 'Close Building',
      position: { x: 0, y: 0, z: 0, lat: 12.981, lon: 77.601 },
      properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3 },
    },
    {
      id: 'b2',
      name: 'Far Building',
      position: { x: 0, y: 0, z: 0, lat: 13.50, lon: 77.60 },
      properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3 },
    },
  ];

  const dummySensors: Sensor[] = [
    {
      id: 's1',
      lat: 12.982,
      lon: 77.602,
      x: null,
      z: null,
      radiusMeters: 5000,
      xzSource: null,
    },
  ];

  it('evaluates distance and sorts closest first', () => {
    const epicenter = { lat: 12.98, lon: 77.60 };
    const affected = evaluateEntities(dummyBuildings, (b) => ({ lat: b.position.lat, lon: b.position.lon }), epicenter, 5.0);
    expect(affected).toHaveLength(2);
    expect(affected[0].entity.id).toBe('b1');
    expect(affected[0].distanceKm).toBeLessThan(affected[1].distanceKm);
    expect(affected[0].severity).toBe('Severe');
    expect(affected[1].severity).toBe('Low');
  });

  it('computes summary statistics accurately', () => {
    const epicenter = { lat: 12.98, lon: 77.60 };
    const affectedBuildings = evaluateEntities(dummyBuildings, (b) => ({ lat: b.position.lat, lon: b.position.lon }), epicenter, 5.0);
    const affectedSensors = evaluateEntities(dummySensors, (s) => ({ lat: s.lat, lon: s.lon }), epicenter, 5.0);

    const summary = computeSeveritySummary(affectedBuildings, affectedSensors);
    expect(summary.totalBuildings).toBe(2);
    expect(summary.totalSensors).toBe(1);
    expect(summary.countsBySeverity.Severe).toBe(1);
    expect(summary.nearestBuilding?.entity.id).toBe('b1');
    expect(summary.farthestBuilding?.entity.id).toBe('b2');
  });
});
