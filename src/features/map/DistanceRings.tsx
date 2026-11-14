import React from 'react';
import { Circle } from 'react-leaflet';
import type { Coordinate } from '../../api/types';
import { getScaledBands } from '../severity/severityEngine';
import { DEFAULT_SEVERITY_CONFIG, type SeverityConfig } from '../severity/severityConfig';

interface DistanceRingsProps {
  epicenter: Coordinate | null;
  magnitude: number;
  config?: SeverityConfig;
}

export const DistanceRings: React.FC<DistanceRingsProps> = ({
  epicenter,
  magnitude,
  config = DEFAULT_SEVERITY_CONFIG,
}) => {
  if (!epicenter) return null;

  const bands = getScaledBands(magnitude, config);
  // Sort descending by distance so larger circles render underneath smaller ones
  const sortedBands = [...bands].sort((a, b) => b.maxDistanceKm - a.maxDistanceKm);

  return (
    <>
      {sortedBands.map((band) => (
        <Circle
          key={band.name}
          center={[epicenter.lat, epicenter.lon]}
          radius={band.maxDistanceKm * 1000} // meters
          pathOptions={{
            color: band.color,
            weight: 1.5,
            fillColor: band.color,
            fillOpacity: band.name === 'Severe' ? 0.18 : band.name === 'High' ? 0.12 : band.name === 'Moderate' ? 0.08 : 0.04,
            dashArray: band.name === 'Low' ? '6, 6' : undefined,
          }}
        />
      ))}
    </>
  );
};
