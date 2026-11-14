import React, { useState, useEffect } from 'react';
import { Sliders, MapPin, RotateCcw, Crosshair } from 'lucide-react';
import type { Coordinate } from '../../api/types';

interface EpicenterControlsProps {
  epicenter: Coordinate | null;
  magnitude: number;
  onMagnitudeChange: (mag: number) => void;
  onEpicenterChange: (coord: Coordinate | null) => void;
  isPickEpicenterMode: boolean;
  onTogglePickEpicenter: () => void;
}

export const EpicenterControls: React.FC<EpicenterControlsProps> = ({
  epicenter,
  magnitude,
  onMagnitudeChange,
  onEpicenterChange,
  isPickEpicenterMode,
  onTogglePickEpicenter,
}) => {
  const [latInput, setLatInput] = useState<string>(epicenter ? epicenter.lat.toString() : '12.980000');
  const [lonInput, setLonInput] = useState<string>(epicenter ? epicenter.lon.toString() : '77.600000');
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (epicenter) {
      setLatInput(epicenter.lat.toFixed(6));
      setLonInput(epicenter.lon.toFixed(6));
    }
  }, [epicenter]);

  const handleApplyCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setInputError('Longitude must be between -180 and 180');
      return;
    }

    setInputError(null);
    onEpicenterChange({ lat, lon });
  };

  const handlePreset = (lat: number, lon: number) => {
    setLatInput(lat.toFixed(6));
    setLonInput(lon.toFixed(6));
    setInputError(null);
    onEpicenterChange({ lat, lon });
  };

  return (
    <div className="ui-card">
      <div className="card-title">
        <Sliders size={16} />
        Epicenter & Magnitude
      </div>

      {/* Magnitude Slider */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label" htmlFor="magnitude-slider">
            Magnitude (Mw):
          </label>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#f97316' }}>
            {magnitude.toFixed(1)}
          </span>
        </div>
        <input
          id="magnitude-slider"
          type="range"
          min="2.0"
          max="9.0"
          step="0.1"
          value={magnitude}
          onChange={(e) => onMagnitudeChange(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: '#f97316' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>2.0 (Minor)</span>
          <span>5.5 (Moderate)</span>
          <span>9.0 (Catastrophic)</span>
        </div>
      </div>

      {/* Manual Coordinates */}
      <form onSubmit={handleApplyCoordinates} style={{ marginTop: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="lat-input">Latitude</label>
            <input
              id="lat-input"
              type="number"
              step="0.000001"
              className="form-input"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="12.980000"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lon-input">Longitude</label>
            <input
              id="lon-input"
              type="number"
              step="0.000001"
              className="form-input"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              placeholder="77.600000"
            />
          </div>
        </div>

        {inputError && (
          <p style={{ color: '#ef4444', fontSize: '11px', marginBottom: '8px' }}>{inputError}</p>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            <MapPin size={13} />
            Set Coordinates
          </button>

          <button
            type="button"
            className={`btn ${isPickEpicenterMode ? 'btn-danger' : 'btn-secondary'} btn-sm`}
            onClick={onTogglePickEpicenter}
            title="Click on the map to place epicenter"
          >
            <Crosshair size={13} />
            {isPickEpicenterMode ? 'Click Map' : 'Map Pick'}
          </button>
        </div>
      </form>

      {/* Presets and Reset */}
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Presets:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handlePreset(12.980000, 77.600000)}
          >
            City Center (0 km)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handlePreset(13.040000, 77.600000)}
          >
            North Fault (+6 km)
          </button>
          {epicenter && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onEpicenterChange(null)}
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              <RotateCcw size={12} />
              Clear Epicenter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
