import React from 'react';
import { Radio, Building2, CircleDot, Maximize2, Crosshair } from 'lucide-react';

interface MapControlsProps {
  showSensors: boolean;
  onToggleSensors: () => void;
  showBuildings: boolean;
  onToggleBuildings: () => void;
  showRings: boolean;
  onToggleRings: () => void;
  isPickEpicenterMode: boolean;
  onTogglePickEpicenter: () => void;
  onFitBounds: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  showSensors,
  onToggleSensors,
  showBuildings,
  onToggleBuildings,
  showRings,
  onToggleRings,
  isPickEpicenterMode,
  onTogglePickEpicenter,
  onFitBounds,
}) => {
  return (
    <div className="layer-controls-panel">
      <button
        className={`toggle-chip ${showSensors ? 'active' : ''}`}
        onClick={onToggleSensors}
        title="Toggle Sensor Pins"
      >
        <Radio size={14} />
        Sensors
      </button>

      <button
        className={`toggle-chip ${showBuildings ? 'active' : ''}`}
        onClick={onToggleBuildings}
        title="Toggle Building Pins"
      >
        <Building2 size={14} />
        Buildings
      </button>

      <button
        className={`toggle-chip ${showRings ? 'active' : ''}`}
        onClick={onToggleRings}
        title="Toggle Earthquake Severity Rings"
      >
        <CircleDot size={14} />
        Distance Rings
      </button>

      <button
        className={`toggle-chip ${isPickEpicenterMode ? 'active' : ''}`}
        onClick={onTogglePickEpicenter}
        style={{
          borderColor: isPickEpicenterMode ? '#ef4444' : undefined,
          backgroundColor: isPickEpicenterMode ? '#ef4444' : undefined,
        }}
        title="Click anywhere on the map to set epicenter"
      >
        <Crosshair size={14} />
        {isPickEpicenterMode ? 'Click Map to Set' : 'Pick Epicenter'}
      </button>

      <button
        className="toggle-chip"
        onClick={onFitBounds}
        title="Zoom and center to fit all markers"
      >
        <Maximize2 size={14} />
        Fit Map
      </button>
    </div>
  );
};
