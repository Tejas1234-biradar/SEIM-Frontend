import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { Building, AffectedEntity } from '../../api/types';
import { createBuildingIcon } from './icons';

interface BuildingMarkersProps {
  buildings: Building[];
  affectedBuildingsMap: Map<string, AffectedEntity<Building>>;
  selectedBuildingId?: string | null;
  onSelectBuilding?: (buildingId: string) => void;
}

export const BuildingMarkers: React.FC<BuildingMarkersProps> = ({
  buildings,
  affectedBuildingsMap,
  selectedBuildingId,
  onSelectBuilding,
}) => {
  return (
    <>
      {buildings.map((building) => {
        const affected = affectedBuildingsMap.get(building.id);
        const severity = affected?.severity || 'None';
        const isSelected = selectedBuildingId === building.id;
        const icon = createBuildingIcon(severity);

        return (
          <Marker
            key={building.id}
            position={[building.position.lat, building.position.lon]}
            icon={icon}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{
              click: () => onSelectBuilding?.(building.id),
            }}
          >
            <Popup>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc' }}>
                    {building.name}
                  </span>
                  {affected && (
                    <span className={`severity-badge severity-${severity}`}>
                      {severity}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  ID: {building.id} • Zone: {building.zoneId || 'N/A'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '3px 12px', fontSize: '12px', marginTop: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Coordinates:</span>
                  <span>{building.position.lat.toFixed(6)}°, {building.position.lon.toFixed(6)}°</span>

                  <span style={{ color: '#94a3b8' }}>Type:</span>
                  <span>{building.properties.type || 'Reinforced Concrete'}</span>

                  <span style={{ color: '#94a3b8' }}>Height:</span>
                  <span>{building.properties.heightMeters || 25} m</span>

                  <span style={{ color: '#94a3b8' }}>Mass / Stiffness:</span>
                  <span>{(building.properties.massKg / 1000).toFixed(0)} t / {(building.properties.stiffness / 1000).toFixed(0)} kN/m</span>

                  <span style={{ color: '#94a3b8' }}>Damage Threshold:</span>
                  <span>{building.properties.damageThresholdG} g</span>

                  {affected && (
                    <>
                      <span style={{ color: '#94a3b8' }}>Epicentral Dist:</span>
                      <span style={{ fontWeight: 600 }}>{affected.distanceKm} km</span>

                      {affected.estimatedPgaG !== undefined && (
                        <>
                          <span style={{ color: '#94a3b8' }}>Est. Ground PGA:</span>
                          <span style={{ fontWeight: 700, color: affected.estimatedPgaG >= building.properties.damageThresholdG ? '#ef4444' : '#10b981' }}>
                            {affected.estimatedPgaG} g {affected.estimatedPgaG >= building.properties.damageThresholdG ? '(Exceeds Threshold)' : '(Safe)'}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
