import L from 'leaflet';
import type { SeverityLevel } from '../../api/types';

const SEVERITY_PIN_COLORS: Record<SeverityLevel, { fill: string; stroke: string }> = {
  Severe: { fill: '#ef4444', stroke: '#991b1b' },
  High: { fill: '#f97316', stroke: '#9a3412' },
  Moderate: { fill: '#eab308', stroke: '#854d0e' },
  Low: { fill: '#0284c7', stroke: '#075985' },
  None: { fill: '#64748b', stroke: '#334155' },
};

/**
 * Custom SVG Marker for placed sensors
 */
export function createSensorIcon(severity?: SeverityLevel) {
  const color = severity ? SEVERITY_PIN_COLORS[severity].fill : '#3b82f6';
  const stroke = severity ? SEVERITY_PIN_COLORS[severity].stroke : '#1d4ed8';

  const html = `
    <div style="position: relative; width: 28px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
        <path d="M14 0C6.268 0 0 6.268 0 14C0 23.5 14 32 14 32C14 32 28 23.5 28 14C28 6.268 21.732 0 14 0Z" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Radio antenna icon inside -->
        <circle cx="14" cy="13" r="3" fill="#ffffff" />
        <path d="M10 9C12.2 7 15.8 7 18 9" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M7 6C10.8 2.5 17.2 2.5 21 6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sensor-icon',
    iconSize: [28, 32],
    iconAnchor: [14, 32],
    popupAnchor: [0, -32],
  });
}

/**
 * Custom SVG Marker for buildings with structural severity coloring
 */
export function createBuildingIcon(severity: SeverityLevel = 'None') {
  const { fill, stroke } = SEVERITY_PIN_COLORS[severity];

  const html = `
    <div style="position: relative; width: 26px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
        <path d="M13 0C6.37 0 1 5.37 1 12C1 20.5 13 30 13 30C13 30 25 20.5 25 12C25 5.37 19.63 0 13 0Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <!-- Building icon inside -->
        <rect x="7" y="6" width="12" height="12" rx="1" fill="#ffffff"/>
        <rect x="9" y="8" width="2" height="2" fill="${fill}"/>
        <rect x="15" y="8" width="2" height="2" fill="${fill}"/>
        <rect x="9" y="12" width="2" height="2" fill="${fill}"/>
        <rect x="15" y="12" width="2" height="2" fill="${fill}"/>
        <rect x="12" y="15" width="2" height="3" fill="${fill}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-building-icon',
    iconSize: [26, 30],
    iconAnchor: [13, 30],
    popupAnchor: [0, -30],
  });
}

/**
 * Epicenter pulsing marker
 */
export function createEpicenterIcon() {
  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div class="pulsing-aura"></div>
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #ef4444; border: 2px solid #ffffff; box-shadow: 0 0 10px #ef4444; display: flex; align-items: center; justify-content: center;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-epicenter-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}
