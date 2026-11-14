export interface Coordinate {
  lat: number;
  lon: number;
}

export interface Origin {
  lat: number;
  lon: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Sensor {
  id: string;
  lat: number;
  lon: number;
  x?: number | null;
  z?: number | null;
  radiusMeters: number;
  xzSource?: string | null;
}

export interface SensorMapResponse {
  placementRunId: string;
  generatedAt: string;
  units: string;
  origin: Origin;
  bounds: Bounds;
  count: number;
  sensors: Sensor[];
}

export interface BuildingPosition {
  x: number;
  y: number;
  z: number;
  lat: number;
  lon: number;
}

export interface BuildingProperties {
  massKg: number;
  stiffness: number;
  dampingCoefficient: number;
  damageThresholdG: number;
  type?: string;
  heightMeters?: number;
  yearBuilt?: number;
}

export interface Building {
  id: string;
  name: string;
  zoneId?: string;
  position: BuildingPosition;
  properties: BuildingProperties;
}

export interface BuildingsDocument {
  origin: Origin;
  count: number;
  buildings: Building[];
}

export type SeverityLevel = 'Severe' | 'High' | 'Moderate' | 'Low' | 'None';

export interface SeverityBandConfig {
  name: SeverityLevel;
  maxDistanceKm: number;
  color: string;
  textColor: string;
  description: string;
}

export interface SimulationConfig {
  magnitude: number;
  epicenter: Coordinate | null;
  bands: SeverityBandConfig[];
}

export interface AffectedEntity<T> {
  entity: T;
  distanceKm: number;
  severity: SeverityLevel;
  estimatedPgaG?: number;
}

export interface SeveritySummaryStats {
  totalBuildings: number;
  totalSensors: number;
  countsBySeverity: Record<SeverityLevel, number>;
  nearestBuilding: AffectedEntity<Building> | null;
  farthestBuilding: AffectedEntity<Building> | null;
}
