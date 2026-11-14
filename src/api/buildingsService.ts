import { BuildingsDocumentSchema } from './schemas';
import type { Building, BuildingsDocument } from './types';

export class BuildingsService {
  private cache: BuildingsDocument | null = null;

  async getBuildings(): Promise<BuildingsDocument> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await fetch('/data/buildings.json');
      if (!response.ok) {
        throw new Error(`Failed to load buildings asset: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const parsed = BuildingsDocumentSchema.safeParse(data);
      if (!parsed.success) {
        console.warn('Buildings data validation warning:', parsed.error);
        return data as BuildingsDocument;
      }
      this.cache = parsed.data as BuildingsDocument;
      return this.cache;
    } catch (err) {
      console.error('Error fetching buildings from /data/buildings.json, using fallback', err);
      return this.getFallbackBuildings();
    }
  }

  getFallbackBuildings(): BuildingsDocument {
    const origin = { lat: 12.98, lon: 77.60 };
    const buildings: Building[] = [
      {
        id: 'bld_001',
        name: 'Building 1 (Zone 6)',
        zoneId: 'Zone_6',
        position: { x: 19.54, y: 1.2, z: -50.21, lat: 12.9795484, lon: 77.6001803 },
        properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3, type: 'Reinforced Concrete', heightMeters: 27, yearBuilt: 2018 },
      },
      {
        id: 'bld_002',
        name: 'Building 2 (Zone 5)',
        zoneId: 'Zone_5',
        position: { x: -3.45, y: 1.20, z: -31.26, lat: 12.9797189, lon: 77.5999682 },
        properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3, type: 'Steel Frame', heightMeters: 27, yearBuilt: 2015 },
      },
      {
        id: 'bld_003',
        name: 'Building 3 (Zone 5)',
        zoneId: 'Zone_5',
        position: { x: -3.45, y: 1.20, z: -44.70, lat: 12.979598, lon: 77.5999682 },
        properties: { massKg: 1000, stiffness: 40000, dampingCoefficient: 12000, damageThresholdG: 0.3, type: 'Reinforced Concrete', heightMeters: 27, yearBuilt: 2020 },
      },
    ];

    return {
      origin,
      count: buildings.length,
      buildings,
    };
  }
}

export const buildingsService = new BuildingsService();
