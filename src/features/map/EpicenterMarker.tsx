import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { Coordinate } from '../../api/types';
import { createEpicenterIcon } from './icons';

interface EpicenterMarkerProps {
  epicenter: Coordinate | null;
  magnitude: number;
}

export const EpicenterMarker: React.FC<EpicenterMarkerProps> = ({ epicenter, magnitude }) => {
  if (!epicenter) return null;

  return (
    <Marker position={[epicenter.lat, epicenter.lon]} icon={createEpicenterIcon()}>
      <Popup>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#ef4444' }}>
            Simulated Epicenter
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>
            Magnitude: {magnitude.toFixed(1)} Mw
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Lat: {epicenter.lat.toFixed(6)}°, Lon: {epicenter.lon.toFixed(6)}°
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
