import type { Coordinate, SeverityLevel, AffectedEntity, SeveritySummaryStats, Building, Sensor } from '../../api/types';
import { haversineDistanceKm } from '../../lib/geo/haversine';
import { DEFAULT_SEVERITY_CONFIG, type SeverityConfig } from './severityConfig';

export interface SeverityModel {
  calculateSeverity(distanceKm: number, magnitude: number, config: SeverityConfig): SeverityLevel;
  estimatePgaG?(distanceKm: number, magnitude: number): number;
}

/**
 * Scales distance band limits according to earthquake magnitude.
 * Uses an empirical scaling exponent: (magnitude - baseMagnitude) * 0.35
 */
export function getScaledBands(magnitude: number, config: SeverityConfig = DEFAULT_SEVERITY_CONFIG) {
  if (!Number.isFinite(magnitude) || magnitude <= 0) {
    throw new Error('Magnitude must be a positive finite number');
  }

  // Factor = 1.0 at baseMagnitude (5.0)
  const factor = Math.max(0.2, Math.pow(10, (magnitude - config.baseMagnitude) * 0.35));

  return config.bands.map((band) => ({
    ...band,
    maxDistanceKm: Math.round(band.maxDistanceKm * factor * 10) / 10,
  }));
}

/**
 * Standard attenuation relation to estimate Peak Ground Acceleration (PGA) in units of g.
 * Simple Joyner-Boore style attenuation model:
 * ln(PGA) = c1 + c2*M - ln(sqrt(R^2 + h^2))
 */
export function estimatePgaG(distanceKm: number, magnitude: number): number {
  if (distanceKm < 0 || !Number.isFinite(distanceKm)) {
    throw new Error('Distance must be a non-negative finite number');
  }
  const focalDepthKm = 10.0;
  const hypocentralDist = Math.sqrt(distanceKm * distanceKm + focalDepthKm * focalDepthKm);
  
  // Empirical approximation calibrated for typical intraplate/shallow crustal events
  const lnPga = -1.2 + 0.65 * magnitude - 1.1 * Math.log(hypocentralDist);
  const pga = Math.exp(lnPga) / 9.81; // convert to g
  return Math.max(0.001, Math.min(2.5, Math.round(pga * 1000) / 1000));
}

export class StandardDistanceSeverityModel implements SeverityModel {
  calculateSeverity(
    distanceKm: number,
    magnitude: number,
    config: SeverityConfig = DEFAULT_SEVERITY_CONFIG
  ): SeverityLevel {
    if (distanceKm < 0 || !Number.isFinite(distanceKm)) {
      throw new Error('Invalid distance: must be a non-negative finite number');
    }

    const scaledBands = getScaledBands(magnitude, config);

    // Sorted in ascending order of distance: Severe (0..5), High (5..15), Moderate (15..40), Low (40..100)
    for (const band of scaledBands) {
      if (distanceKm <= band.maxDistanceKm) {
        return band.name;
      }
    }

    return 'None';
  }

  estimatePgaG(distanceKm: number, magnitude: number): number {
    return estimatePgaG(distanceKm, magnitude);
  }
}

export const defaultSeverityModel = new StandardDistanceSeverityModel();

/**
 * Computes severity for a given distance and magnitude.
 */
export function severityFor(
  distanceKm: number,
  magnitude: number,
  config: SeverityConfig = DEFAULT_SEVERITY_CONFIG,
  model: SeverityModel = defaultSeverityModel
): SeverityLevel {
  return model.calculateSeverity(distanceKm, magnitude, config);
}

/**
 * Evaluates an array of entities against an epicenter, returning sorted affected entities with distances.
 */
export function evaluateEntities<T>(
  entities: T[],
  getCoords: (item: T) => Coordinate,
  epicenter: Coordinate,
  magnitude: number,
  config: SeverityConfig = DEFAULT_SEVERITY_CONFIG,
  model: SeverityModel = defaultSeverityModel
): AffectedEntity<T>[] {
  if (!epicenter) return [];

  const results: AffectedEntity<T>[] = entities.map((item) => {
    const coords = getCoords(item);
    const distanceKm = haversineDistanceKm(coords, epicenter);
    const severity = severityFor(distanceKm, magnitude, config, model);
    const estimatedPga = model.estimatePgaG ? model.estimatePgaG(distanceKm, magnitude) : undefined;

    return {
      entity: item,
      distanceKm: Math.round(distanceKm * 100) / 100,
      severity,
      estimatedPgaG: estimatedPga,
    };
  });

  // Sort ascending by distance (closest first)
  results.sort((a, b) => a.distanceKm - b.distanceKm);
  return results;
}

/**
 * Computes aggregate summary statistics for affected buildings and sensors.
 */
export function computeSeveritySummary(
  affectedBuildings: AffectedEntity<Building>[],
  affectedSensors: AffectedEntity<Sensor>[]
): SeveritySummaryStats {
  const countsBySeverity: Record<SeverityLevel, number> = {
    Severe: 0,
    High: 0,
    Moderate: 0,
    Low: 0,
    None: 0,
  };

  for (const b of affectedBuildings) {
    countsBySeverity[b.severity]++;
  }

  return {
    totalBuildings: affectedBuildings.length,
    totalSensors: affectedSensors.length,
    countsBySeverity,
    nearestBuilding: affectedBuildings.length > 0 ? affectedBuildings[0] : null,
    farthestBuilding: affectedBuildings.length > 0 ? affectedBuildings[affectedBuildings.length - 1] : null,
  };
}
