import type { Sensor, SensorMapResponse } from '../api/types';

export const realisticSensorsResponse: SensorMapResponse = {
  placementRunId: '4b9ed75d-3e2f-4de0-b1a0-4a47b1620db4',
  generatedAt: '2026-11-07T15:27:28.941Z',
  units: 'meters',
  origin: { lat: 12.98, lon: 77.60 },
  bounds: { minX: -250.0, maxX: 250.0, minZ: -300.0, maxZ: 300.0 },
  count: 6,
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
    {
      id: '8cb1742a-4421-4f12-a1b9-381c0e09152b',
      lat: 12.975,
      lon: 77.595,
      x: -50.0,
      z: -30.0,
      radiusMeters: 5000.0,
      xzSource: 'unity',
    },
    {
      id: '1e4a908f-7f89-4b62-9e23-871d3a4b9101',
      lat: 12.985,
      lon: 77.605,
      x: 25.0,
      z: 15.0,
      radiusMeters: 5000.0,
      xzSource: 'unity',
    },
    {
      id: 'e29f3d10-8b1a-4c22-9011-aa9b01243781',
      lat: 12.965,
      lon: 77.585,
      x: -120.0,
      z: -95.0,
      radiusMeters: 5000.0,
      xzSource: 'unity',
    },
    {
      id: '4c810de4-6b21-4d33-a85f-8c7634e2098b',
      lat: 12.995,
      lon: 77.625,
      x: 180.0,
      z: 140.0,
      radiusMeters: 5000.0,
      xzSource: 'unity',
    },
    {
      id: '992a831e-128a-493d-9d41-3b7c01d9812e',
      lat: 12.982,
      lon: 77.612,
      x: 45.0,
      z: 12.0,
      radiusMeters: 5000.0,
      xzSource: 'unity',
    },
  ],
};

export const emptySensorsResponse: SensorMapResponse = {
  placementRunId: '00000000-0000-0000-0000-000000000000',
  generatedAt: new Date().toISOString(),
  units: 'meters',
  origin: { lat: 12.98, lon: 77.60 },
  bounds: { minX: 0, maxX: 0, minZ: 0, maxZ: 0 },
  count: 0,
  sensors: [],
};

export const missingOptionalFieldsResponse: SensorMapResponse = {
  placementRunId: '3f760e1d-a9b0-4c11-b209-781c00998123',
  generatedAt: '2026-11-01T10:00:00.000Z',
  units: 'meters',
  origin: { lat: 12.98, lon: 77.60 },
  bounds: { minX: -100, maxX: 100, minZ: -100, maxZ: 100 },
  count: 2,
  sensors: [
    {
      id: 'sensor-no-xz-1',
      lat: 12.981,
      lon: 77.601,
      x: null,
      z: null,
      radiusMeters: 5000.0,
      xzSource: null,
    },
    {
      id: 'sensor-no-xz-2',
      lat: 12.979,
      lon: 77.599,
      x: null,
      z: null,
      radiusMeters: 5000.0,
      xzSource: null,
    },
  ],
};

/**
 * Generate 5,000+ realistic sensor records for scale/stress testing
 */
export function generateScaleSensors(count: number = 5000): SensorMapResponse {
  const baseLat = 12.98;
  const baseLon = 77.60;
  const sensors: Sensor[] = [];

  for (let i = 0; i < count; i++) {
    // Distribute within ~20km radius
    const angle = (i / count) * 2 * Math.PI * 15;
    const distance = Math.sqrt(i / count) * 0.2; // approx up to 20 km degrees
    const lat = baseLat + distance * Math.cos(angle);
    const lon = baseLon + distance * Math.sin(angle);

    sensors.push({
      id: `scale-sensor-${(i + 1).toString().padStart(5, '0')}`,
      lat: Number(lat.toFixed(6)),
      lon: Number(lon.toFixed(6)),
      x: Math.round(distance * 111000 * Math.cos(angle)),
      z: Math.round(distance * 111000 * Math.sin(angle)),
      radiusMeters: 5000.0,
      xzSource: 'synthetic',
    });
  }

  return {
    placementRunId: 'scale-test-run-5000',
    generatedAt: new Date().toISOString(),
    units: 'meters',
    origin: { lat: baseLat, lon: baseLon },
    bounds: { minX: -20000, maxX: 20000, minZ: -20000, maxZ: 20000 },
    count: sensors.length,
    sensors,
  };
}
