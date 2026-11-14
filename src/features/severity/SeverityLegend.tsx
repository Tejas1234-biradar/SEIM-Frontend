import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { getScaledBands } from './severityEngine';
import { DEFAULT_SEVERITY_CONFIG, type SeverityConfig } from './severityConfig';
import type { SeverityLevel } from '../../api/types';

interface SeverityLegendProps {
  magnitude: number;
  config?: SeverityConfig;
}

const SEVERITY_ICONS: Record<SeverityLevel, React.ReactNode> = {
  Severe: <ShieldAlert size={14} color="#ef4444" />,
  High: <AlertTriangle size={14} color="#f97316" />,
  Moderate: <AlertCircle size={14} color="#eab308" />,
  Low: <Info size={14} color="#0284c7" />,
  None: null,
};

export const SeverityLegend: React.FC<SeverityLegendProps> = ({
  magnitude,
  config = DEFAULT_SEVERITY_CONFIG,
}) => {
  const bands = getScaledBands(magnitude, config);

  return (
    <div className="ui-card">
      <div className="card-title">
        <ShieldAlert size={16} />
        Disaster Severity Bands (M{magnitude.toFixed(1)})
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {bands.map((band, idx) => {
          const prevDist = idx === 0 ? 0 : bands[idx - 1].maxDistanceKm;
          const rangeLabel = `${prevDist} – ${band.maxDistanceKm} km`;

          return (
            <div
              key={band.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: `4px solid ${band.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {SEVERITY_ICONS[band.name]}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{band.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{band.description}</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: band.color,
                  backgroundColor: 'var(--bg-primary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {rangeLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
