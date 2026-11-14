import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { MapContainer } from './features/map/MapContainer';
import { MapControls } from './features/map/MapControls';
import { EpicenterControls } from './features/severity/EpicenterControls';
import { SeverityLegend } from './features/severity/SeverityLegend';
import { SeveritySummary } from './features/severity/SeveritySummary';
import { AffectedBuildingsTable } from './features/severity/AffectedBuildingsTable';
import { apiClient } from './api/client';
import { buildingsService } from './api/buildingsService';
import { evaluateEntities, computeSeveritySummary } from './features/severity/severityEngine';
import type { Coordinate, AffectedEntity, Building, Sensor } from './api/types';
import { Sliders, Building2, ShieldAlert } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const queryClient = useQueryClient();

  // Simulation State
  const [epicenter, setEpicenter] = useState<Coordinate | null>({ lat: 12.98, lon: 77.60 });
  const [magnitude, setMagnitude] = useState<number>(5.5);
  const [isPickEpicenterMode, setIsPickEpicenterMode] = useState<boolean>(false);

  // Layer Toggles
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showBuildings, setShowBuildings] = useState<boolean>(true);
  const [showRings, setShowRings] = useState<boolean>(true);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'epicenter' | 'buildings' | 'legend'>('epicenter');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState<number>(0);
  const [isMockEnabled, setIsMockEnabled] = useState<boolean>(false);

  // Fetch Sensors from backend / MSW
  const {
    data: sensorsResponse,
    isLoading: isLoadingSensors,
    isError: isSensorError,
    error: sensorError,
    refetch: refetchSensors,
  } = useQuery({
    queryKey: ['sensors', isMockEnabled],
    queryFn: async () => {
      const res = await apiClient.getSensors();
      return res.data;
    },
    staleTime: 30000,
    retry: 1,
  });

  // Fetch Buildings from Unity-extracted assets
  const {
    data: buildingsResponse,
    isLoading: isLoadingBuildings,
    isError: isBuildingError,
    error: buildingError,
    refetch: refetchBuildings,
  } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => buildingsService.getBuildings(),
    staleTime: Infinity,
  });

  const sensors = useMemo(() => sensorsResponse?.sensors || [], [sensorsResponse]);
  const buildings = useMemo(() => buildingsResponse?.buildings || [], [buildingsResponse]);

  // Compute affected entities when epicenter or magnitude changes
  const affectedBuildings = useMemo(() => {
    if (!epicenter) return [];
    return evaluateEntities(
      buildings,
      (b) => ({ lat: b.position.lat, lon: b.position.lon }),
      epicenter,
      magnitude
    );
  }, [buildings, epicenter, magnitude]);

  const affectedSensors = useMemo(() => {
    if (!epicenter) return [];
    return evaluateEntities(
      sensors,
      (s) => ({ lat: s.lat, lon: s.lon }),
      epicenter,
      magnitude
    );
  }, [sensors, epicenter, magnitude]);

  // Fast O(1) lookup maps for marker coloring
  const affectedBuildingsMap = useMemo(() => {
    const map = new Map<string, AffectedEntity<Building>>();
    for (const item of affectedBuildings) {
      map.set(item.entity.id, item);
    }
    return map;
  }, [affectedBuildings]);

  const affectedSensorsMap = useMemo(() => {
    const map = new Map<string, AffectedEntity<Sensor>>();
    for (const item of affectedSensors) {
      map.set(item.entity.id, item);
    }
    return map;
  }, [affectedSensors]);

  // Compute summary stats
  const summaryStats = useMemo(() => {
    return computeSeveritySummary(affectedBuildings, affectedSensors);
  }, [affectedBuildings, affectedSensors]);

  const handleRefresh = () => {
    refetchSensors();
    refetchBuildings();
  };

  const handleToggleMock = async () => {
    if (!isMockEnabled) {
      // Dynamically start MSW worker
      try {
        const { worker } = await import('./mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        setIsMockEnabled(true);
        queryClient.invalidateQueries();
      } catch (err) {
        console.error('Failed to start MSW worker', err);
      }
    } else {
      setIsMockEnabled(false);
      queryClient.invalidateQueries();
    }
  };

  const handleSetEpicenter = (coord: Coordinate) => {
    setEpicenter(coord);
    setIsPickEpicenterMode(false);
  };

  const handleSelectBuilding = (id: string) => {
    setSelectedBuildingId(id);
    setActiveTab('buildings');
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  const isLoading = isLoadingSensors || isLoadingBuildings;

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        placementRunId={sensorsResponse?.placementRunId}
        sensorCount={sensors.length}
        buildingCount={buildings.length}
        isLoading={isLoading}
        isMockEnabled={isMockEnabled}
        onToggleMock={handleToggleMock}
        onRefresh={handleRefresh}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="main-content">
        {/* Map Viewport */}
        <div className="map-viewport">
          <MapContainer
            sensors={sensors}
            buildings={buildings}
            affectedSensorsMap={affectedSensorsMap}
            affectedBuildingsMap={affectedBuildingsMap}
            epicenter={epicenter}
            magnitude={magnitude}
            showSensors={showSensors}
            showBuildings={showBuildings}
            showRings={showRings}
            isPickEpicenterMode={isPickEpicenterMode}
            onSetEpicenter={handleSetEpicenter}
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={handleSelectBuilding}
            fitBoundsTrigger={fitBoundsTrigger}
          />

          {/* Map Floating Controls */}
          <div className="map-overlay-top-left">
            <MapControls
              showSensors={showSensors}
              onToggleSensors={() => setShowSensors(!showSensors)}
              showBuildings={showBuildings}
              onToggleBuildings={() => setShowBuildings(!showBuildings)}
              showRings={showRings}
              onToggleRings={() => setShowRings(!showRings)}
              isPickEpicenterMode={isPickEpicenterMode}
              onTogglePickEpicenter={() => setIsPickEpicenterMode(!isPickEpicenterMode)}
              onFitBounds={() => setFitBoundsTrigger((prev) => prev + 1)}
            />

            {isLoading && (
              <div style={{ background: 'rgba(30, 41, 59, 0.9)', borderRadius: '8px', padding: '6px' }}>
                <LoadingSpinner label="Fetching sensors & structures..." size={16} />
              </div>
            )}

            {/* Error notifications if backend is down */}
            {isSensorError && (
              <ErrorAlert
                title="Backend Sensor API Offline"
                message={(sensorError as Error)?.message || 'Could not connect to http://localhost:8080. Switch to Mock Mode in the navbar to test with mock data.'}
                onRetry={() => refetchSensors()}
              />
            )}
            {isBuildingError && (
              <ErrorAlert
                title="Building Asset Error"
                message={(buildingError as Error)?.message || 'Could not load buildings. Fallback mock buildings are active.'}
              />
            )}
          </div>
        </div>

        {/* Sidebar Panel */}
        <aside className={`sidebar ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === 'epicenter' ? 'active' : ''}`}
              onClick={() => setActiveTab('epicenter')}
            >
              <Sliders size={14} />
              Simulation
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'buildings' ? 'active' : ''}`}
              onClick={() => setActiveTab('buildings')}
            >
              <Building2 size={14} />
              Structures ({buildings.length})
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'legend' ? 'active' : ''}`}
              onClick={() => setActiveTab('legend')}
            >
              <ShieldAlert size={14} />
              Bands & Legend
            </button>
          </div>

          <div className="sidebar-body">
            {activeTab === 'epicenter' && (
              <>
                <EpicenterControls
                  epicenter={epicenter}
                  magnitude={magnitude}
                  onMagnitudeChange={setMagnitude}
                  onEpicenterChange={setEpicenter}
                  isPickEpicenterMode={isPickEpicenterMode}
                  onTogglePickEpicenter={() => setIsPickEpicenterMode(!isPickEpicenterMode)}
                />
                <SeveritySummary
                  summary={summaryStats}
                  hasEpicenter={epicenter !== null}
                />
              </>
            )}

            {activeTab === 'buildings' && (
              <AffectedBuildingsTable
                affectedBuildings={affectedBuildings}
                selectedBuildingId={selectedBuildingId}
                onSelectBuilding={handleSelectBuilding}
              />
            )}

            {activeTab === 'legend' && (
              <SeverityLegend magnitude={magnitude} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
