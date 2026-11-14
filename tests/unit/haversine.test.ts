import { describe, it, expect } from 'vitest';
import { haversineDistanceKm, computeBounds } from '@/lib/geo/haversine';

describe('haversineDistanceKm', () => {
  it('returns 0 when coordinates are identical', () => {
    const pt = { lat: 12.98, lon: 77.60 };
    expect(haversineDistanceKm(pt, pt)).toBe(0);
  });

  it('calculates accurate distance between known cities (London to Paris)', () => {
    const london = { lat: 51.5074, lon: -0.1278 };
    const paris = { lat: 48.8566, lon: 2.3522 };
    const dist = haversineDistanceKm(london, paris);
    // Real distance is ~343.5 km
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(350);
  });

  it('handles antimeridian crossing correctly (e.g. 179°E to -179°W across 180°)', () => {
    const westOfDateLine = { lat: 0, lon: 179.5 };
    const eastOfDateLine = { lat: 0, lon: -179.5 };
    const dist = haversineDistanceKm(westOfDateLine, eastOfDateLine);
    // 1 degree longitude at equator is ~111.2 km, NOT ~39,800 km going the long way!
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(113);
  });

  it('throws error for invalid latitude (>90 or <-90)', () => {
    expect(() => haversineDistanceKm({ lat: 91, lon: 0 }, { lat: 0, lon: 0 })).toThrow(/Latitude/);
    expect(() => haversineDistanceKm({ lat: -95, lon: 0 }, { lat: 0, lon: 0 })).toThrow(/Latitude/);
  });

  it('throws error for invalid longitude (>180 or <-180)', () => {
    expect(() => haversineDistanceKm({ lat: 0, lon: 181 }, { lat: 0, lon: 0 })).toThrow(/Longitude/);
    expect(() => haversineDistanceKm({ lat: 0, lon: -185 }, { lat: 0, lon: 0 })).toThrow(/Longitude/);
  });

  it('throws error for non-finite coordinates (NaN, Infinity)', () => {
    expect(() => haversineDistanceKm({ lat: NaN, lon: 0 }, { lat: 0, lon: 0 })).toThrow(/finite/);
    expect(() => haversineDistanceKm({ lat: 0, lon: Infinity }, { lat: 0, lon: 0 })).toThrow(/finite/);
  });
});

describe('computeBounds', () => {
  it('returns null for empty array', () => {
    expect(computeBounds([])).toBeNull();
  });

  it('returns valid min/max bounds for array of points', () => {
    const points = [
      { lat: 10, lon: 20 },
      { lat: 15, lon: 10 },
      { lat: 12, lon: 30 },
    ];
    const bounds = computeBounds(points);
    expect(bounds).toEqual({
      minLat: 10,
      maxLat: 15,
      minLon: 10,
      maxLon: 30,
    });
  });
});
