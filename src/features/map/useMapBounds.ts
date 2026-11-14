import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinate } from '../../api/types';

export function useMapBounds(points: Coordinate[], shouldFit: boolean = true) {
  const map = useMap();

  useEffect(() => {
    if (!shouldFit || !points || points.length === 0) return;

    const latLngs = points
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .map((p) => [p.lat, p.lon] as [number, number]);

    if (latLngs.length === 0) return;

    if (latLngs.length === 1) {
      map.setView(latLngs[0], 14);
      return;
    }

    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
      animate: true,
    });
  }, [map, points, shouldFit]);
}
