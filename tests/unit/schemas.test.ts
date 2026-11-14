import { describe, it, expect } from 'vitest';
import {
  LatitudeSchema,
  LongitudeSchema,
  SensorSchema,
  SensorMapResponseSchema,
  BuildingSchema,
} from '@/api/schemas';

describe('Zod Coordinate Schemas', () => {
  it('accepts valid latitude and longitude', () => {
    expect(LatitudeSchema.parse(12.98)).toBe(12.98);
    expect(LatitudeSchema.parse(-90)).toBe(-90);
    expect(LatitudeSchema.parse(90)).toBe(90);

    expect(LongitudeSchema.parse(77.60)).toBe(77.60);
    expect(LongitudeSchema.parse(-180)).toBe(-180);
    expect(LongitudeSchema.parse(180)).toBe(180);
  });

  it('rejects latitude out of -90..90 range', () => {
    expect(() => LatitudeSchema.parse(90.1)).toThrow();
    expect(() => LatitudeSchema.parse(-90.1)).toThrow();
    expect(() => LatitudeSchema.parse(NaN)).toThrow();
  });

  it('rejects longitude out of -180..180 range', () => {
    expect(() => LongitudeSchema.parse(180.1)).toThrow();
    expect(() => LongitudeSchema.parse(-180.1)).toThrow();
    expect(() => LongitudeSchema.parse(Infinity)).toThrow();
  });
});

describe('SensorSchema', () => {
  it('validates correct sensor payload', () => {
    const validSensor = {
      id: '3da26754-2733-405a-8337-f68f291a5e39',
      lat: 12.99,
      lon: 77.61,
      x: null,
      z: null,
      radiusMeters: 5000.0,
      xzSource: null,
    };
    expect(SensorSchema.parse(validSensor)).toEqual(validSensor);
  });

  it('rejects sensor with missing or invalid fields', () => {
    expect(() =>
      SensorSchema.parse({
        id: '',
        lat: 12.99,
        lon: 77.61,
        radiusMeters: 5000.0,
      })
    ).toThrow();

    expect(() =>
      SensorSchema.parse({
        id: 'sens-1',
        lat: 12.99,
        lon: 77.61,
        radiusMeters: -5, // negative radius
      })
    ).toThrow();
  });
});

describe('SensorMapResponseSchema and BuildingSchema', () => {
  it('validates complete backend sensor map response', () => {
    const validResponse = {
      placementRunId: '4b9ed75d-3e2f-4de0-b1a0-4a47b1620db4',
      generatedAt: '2026-11-07T15:27:28.941Z',
      units: 'meters',
      origin: { lat: 12.98, lon: 77.6 },
      bounds: { minX: -250.0, maxX: 250.0, minZ: -300.0, maxZ: 300.0 },
      count: 1,
      sensors: [
        {
          id: '3da26754-2733-405a-8337-f68f291a5e39',
          lat: 12.99,
          lon: 77.61,
          x: 10.0,
          z: 20.0,
          radiusMeters: 5000.0,
          xzSource: 'unity',
        },
      ],
    };
    expect(SensorMapResponseSchema.parse(validResponse)).toBeDefined();
  });

  it('validates building record from Unity extraction', () => {
    const validBuilding = {
      id: 'bld_001',
      name: 'Building 1 (Zone 6)',
      zoneId: 'Zone_6',
      position: {
        x: 19.54,
        y: 1.2,
        z: -50.21,
        lat: 12.9795,
        lon: 77.6001,
      },
      properties: {
        massKg: 1000,
        stiffness: 40000,
        dampingCoefficient: 12000,
        damageThresholdG: 0.3,
        type: 'Reinforced Concrete',
        heightMeters: 27,
        yearBuilt: 2018,
      },
    };
    expect(BuildingSchema.parse(validBuilding)).toBeDefined();
  });
});
