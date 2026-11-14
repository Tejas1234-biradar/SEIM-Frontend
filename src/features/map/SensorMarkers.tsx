import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import type { Sensor, AffectedEntity } from '../../api/types';
import { createSensorIcon } from './icons';

interface SensorMarkersProps {
  sensors: Sensor[];
  affectedSensorsMap: Map<string, AffectedEntity<Sensor>>;
  showCoverageRadius?: boolean;
}

export const SensorMarkers: React.FC<SensorMarkersProps> = ({
  sensors,
  affectedSensorsMap,
  showCoverageRadius = false,
}) => {
  return (
    <>
      {sensors.map((sensor) => {
        const affected = affectedSensorsMap.get(sensor.id);
        const icon = createSensorIcon(affected?.severity);

        return (
          <React.Fragment key={sensor.id}>
            <Marker position={[sensor.lat, sensor.lon]} icon={icon}>
              <Popup>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#60a5fa' }}>
                    Sensor Station
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all' }}>
                    UUID: {sensor.id}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 12px', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>Latitude:</span>
                    <span>{sensor.lat.toFixed(6)}°</span>
                    <span style={{ color: '#94a3b8' }}>Longitude:</span>
                    <span>{sensor.lon.toFixed(6)}°</span>
                    {sensor.x !== null && sensor.z !== null && (
                      <>
                        <span style={{ color: '#94a3b8' }}>Unity Pos (x, z):</span>
                        <span>({sensor.x?.toFixed(1)}m, {sensor.z?.toFixed(1)}m)</span>
                      </>
                    )}
                    <span style={{ color: '#94a3b8' }}>Radius:</span>
                    <span>{(sensor.radiusMeters / 1000).toFixed(1)} km</span>
                  </div>

                  {affected && (
                    <div
                      style={{
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px solid #334155',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Epicenter Dist:</span>
                      <span style={{ fontWeight: 600 }}>{affected.distanceKm} km</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>

            {showCoverageRadius && (
              <Circle
                center={[sensor.lat, sensor.lon]}
                radius={sensor.radiusMeters}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 1,
                  dashArray: '4, 6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.05,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
