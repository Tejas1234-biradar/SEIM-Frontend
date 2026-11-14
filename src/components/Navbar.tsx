import React from 'react';
import { Activity, RefreshCw, Layers, Database } from 'lucide-react';

interface NavbarProps {
  placementRunId?: string;
  sensorCount?: number;
  buildingCount?: number;
  isLoading?: boolean;
  isMockEnabled: boolean;
  onToggleMock: () => void;
  onRefresh: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  placementRunId,
  sensorCount = 0,
  buildingCount = 0,
  isLoading = false,
  isMockEnabled,
  onToggleMock,
  onRefresh,
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <Activity size={20} />
        </div>
        <div>
          <h1 className="brand-title">SEIM Simulation</h1>
          <p className="brand-subtitle">Sensor & Disaster Severity Dashboard</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Status Pill */}
        <div className="status-pill" title={placementRunId ? `Run: ${placementRunId}` : 'No active run'}>
          <div className={`status-dot ${isLoading ? 'loading' : ''}`} />
          <span>
            {sensorCount} Sensors • {buildingCount} Buildings
          </span>
        </div>

        {/* Mock/Real Mode Toggle */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleMock}
          title={isMockEnabled ? 'Switch to Real Backend (http://localhost:8080)' : 'Switch to Mock Service Worker'}
        >
          <Database size={13} />
          {isMockEnabled ? 'Mode: MSW Mock' : 'Mode: Live Backend'}
        </button>

        {/* Refresh Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isLoading}
          title="Reload latest placement & sensor data"
        >
          <RefreshCw size={13} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>

        {/* Sidebar Toggle */}
        <button
          className={`btn ${isSidebarOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={toggleSidebar}
          title="Toggle Simulation Control Panel"
        >
          <Layers size={13} />
          {isSidebarOpen ? 'Hide Panel' : 'Simulation Panel'}
        </button>
      </div>
    </header>
  );
};
