import type { Coordinate } from '../../api/types';

export const EARTH_RADIUS_KM = 6371.0;

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 *
 * @param a First coordinate { lat, lon }
 * @param b Second coordinate { lat, lon }
 * @returns Distance in kilometers
 */
export function haversineDistanceKm(a: Coordinate, b: Coordinate): number {
  if (
    !Number.isFinite(a.lat) ||
    !Number.isFinite(a.lon) ||
    !Number.isFinite(b.lat) ||
    !Number.isFinite(b.lon)
  ) {
    throw new Error('Invalid coordinate: lat and lon must be finite numbers');
  }

  if (a.lat < -90 || a.lat > 90 || b.lat < -90 || b.lat > 90) {
    throw new Error('Latitude out of range: must be between -90 and 90');
  }

  if (a.lon < -180 || a.lon > 180 || b.lon < -180 || b.lon > 180) {
    throw new Error('Longitude out of range: must be between -180 and 180');
  }

  // Exact same point optimization
  if (a.lat === b.lat && a.lon === b.lon) {
    return 0.0;
  }

  const toRad = Math.PI / 180;
  const lat1 = a.lat * toRad;
  const lat2 = b.lat * toRad;
  const deltaLat = (b.lat - a.lat) * toRad;

  // Handle antimeridian crossing properly for deltaLon
  let diffLon = b.lon - a.lon;
  while (diffLon > 180) diffLon -= 360;
  while (diffLon < -180) diffLon += 360;
  const deltaLon = diffLon * toRad;

  const sinDeltaLat = Math.sin(deltaLat / 2);
  const sinDeltaLon = Math.sin(deltaLon / 2);

  const h =
    sinDeltaLat * sinDeltaLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDeltaLon * sinDeltaLon;

  // Clamp to prevent NaN due to floating point inaccuracies
  const clampedH = Math.min(1.0, Math.max(0.0, h));
  const c = 2 * Math.atan2(Math.sqrt(clampedH), Math.sqrt(1 - clampedH));

  return EARTH_RADIUS_KM * c;
}

/**
 * Computes min/max bounding box for an array of coordinates
 */
export function computeBounds(points: Coordinate[]): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} | null {
  if (!points || points.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const pt of points) {
    if (pt.lat < minLat) minLat = pt.lat;
    if (pt.lat > maxLat) maxLat = pt.lat;
    if (pt.lon < minLon) minLon = pt.lon;
    if (pt.lon > maxLon) maxLon = pt.lon;
  }

  return { minLat, maxLat, minLon, maxLon };
}
