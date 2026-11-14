import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinate, Sensor, Building, AffectedEntity } from '../../api/types';
import { SensorMarkers } from './SensorMarkers';
import { BuildingMarkers } from './BuildingMarkers';
import { EpicenterMarker } from './EpicenterMarker';
import { DistanceRings } from './DistanceRings';
import type { SeverityConfig } from '../severity/severityConfig';

interface MapViewProps {
  sensors: Sensor[];
  buildings: Building[];
  affectedSensorsMap: Map<string, AffectedEntity<Sensor>>;
  affectedBuildingsMap: Map<string, AffectedEntity<Building>>;
  epicenter: Coordinate | null;
  magnitude: number;
  severityConfig?: SeverityConfig;
  showSensors: boolean;
  showBuildings: boolean;
  showRings: boolean;
  isPickEpicenterMode: boolean;
  onSetEpicenter: (coord: Coordinate) => void;
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string) => void;
  fitBoundsTrigger: number;
}

const DEFAULT_CENTER: [number, number] = [12.98, 77.60];
const DEFAULT_ZOOM = 13;

function MapEventsHandler({
  isPickEpicenterMode,
  onSetEpicenter,
}: {
  isPickEpicenterMode: boolean;
  onSetEpicenter: (coord: Coordinate) => void;
}) {
  useMapEvents({
    click(e) {
      if (isPickEpicenterMode) {
        onSetEpicenter({
          lat: Number(e.latlng.lat.toFixed(6)),
          lon: Number(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
}

function MapBoundsController({
  points,
  fitBoundsTrigger,
  selectedBuilding,
}: {
  points: Coordinate[];
  fitBoundsTrigger: number;
  selectedBuilding: Building | undefined;
}) {
  const map = useMap();
  const initialFitDone = useRef(false);

  // Auto-fit on initial load or explicit trigger
  useEffect(() => {
    if (points.length === 0) return;

    if (!initialFitDone.current || fitBoundsTrigger > 0) {
      const latLngs = points
        .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
        .map((p) => [p.lat, p.lon] as [number, number]);

      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        initialFitDone.current = true;
      }
    }
  }, [map, points, fitBoundsTrigger]);

  // Center on selected building when user clicks a row in the table
  useEffect(() => {
    if (selectedBuilding) {
      map.setView([selectedBuilding.position.lat, selectedBuilding.position.lon], 16, {
        animate: true,
      });
    }
  }, [map, selectedBuilding]);

  return null;
}

export const MapContainer: React.FC<MapViewProps> = ({
  sensors,
  buildings,
  affectedSensorsMap,
  affectedBuildingsMap,
  epicenter,
  magnitude,
  severityConfig,
  showSensors,
  showBuildings,
  showRings,
  isPickEpicenterMode,
  onSetEpicenter,
  selectedBuildingId,
  onSelectBuilding,
  fitBoundsTrigger,
}) => {
  const tileUrl = import.meta.env.VITE_TILE_LAYER_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttr = import.meta.env.VITE_TILE_LAYER_ATTRIBUTION || '&copy; OpenStreetMap contributors';

  // Aggregate all point coordinates for bounds calculations
  const allPoints: Coordinate[] = [
    ...sensors.map((s) => ({ lat: s.lat, lon: s.lon })),
    ...buildings.map((b) => ({ lat: b.position.lat, lon: b.position.lon })),
  ];
  if (epicenter) {
    allPoints.push(epicenter);
  }

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  return (
    <LeafletMap
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', cursor: isPickEpicenterMode ? 'crosshair' : 'grab' }}
    >
      <TileLayer url={tileUrl} attribution={tileAttr} />

      <MapEventsHandler
        isPickEpicenterMode={isPickEpicenterMode}
        onSetEpicenter={onSetEpicenter}
      />

      <MapBoundsController
        points={allPoints}
        fitBoundsTrigger={fitBoundsTrigger}
        selectedBuilding={selectedBuilding}
      />

      {/* Earthquake Severity Distance Rings */}
      {showRings && epicenter && (
        <DistanceRings
          epicenter={epicenter}
          magnitude={magnitude}
          config={severityConfig}
        />
      )}

      {/* Sensor Layer */}
      {showSensors && (
        <SensorMarkers
          sensors={sensors}
          affectedSensorsMap={affectedSensorsMap}
          showCoverageRadius={false}
        />
      )}

      {/* Buildings Layer */}
      {showBuildings && (
        <BuildingMarkers
          buildings={buildings}
          affectedBuildingsMap={affectedBuildingsMap}
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={onSelectBuilding}
        />
      )}

      {/* Epicenter Marker */}
      <EpicenterMarker epicenter={epicenter} magnitude={magnitude} />
    </LeafletMap>
  );
};
