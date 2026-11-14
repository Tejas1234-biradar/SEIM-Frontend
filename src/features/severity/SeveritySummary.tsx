import React from 'react';
import { Activity, Building2, MapPin } from 'lucide-react';
import type { SeveritySummaryStats } from '../../api/types';

interface SeveritySummaryProps {
  summary: SeveritySummaryStats;
  hasEpicenter: boolean;
}

export const SeveritySummary: React.FC<SeveritySummaryProps> = ({ summary, hasEpicenter }) => {
  if (!hasEpicenter) {
    return (
      <div className="ui-card">
        <div className="card-title">
          <Activity size={16} />
          Impact Analysis Summary
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          No active earthquake epicenter set. Use the map pick tool or enter coordinates to calculate building damage severity and epicentral attenuation.
        </p>
      </div>
    );
  }

  return (
    <div className="ui-card">
      <div className="card-title">
        <Activity size={16} />
        Structural Impact Summary
      </div>

      <div className="stats-grid">
        <div className="stat-box" style={{ borderLeft: '3px solid #ef4444' }}>
          <span className="stat-box-label">Severe Risk</span>
          <span className="stat-box-value" style={{ color: '#ef4444' }}>
            {summary.countsBySeverity.Severe}
          </span>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #f97316' }}>
          <span className="stat-box-label">High Risk</span>
          <span className="stat-box-value" style={{ color: '#f97316' }}>
            {summary.countsBySeverity.High}
          </span>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #eab308' }}>
          <span className="stat-box-label">Moderate</span>
          <span className="stat-box-value" style={{ color: '#eab308' }}>
            {summary.countsBySeverity.Moderate}
          </span>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #0284c7' }}>
          <span className="stat-box-label">Low / Felt</span>
          <span className="stat-box-value" style={{ color: '#0284c7' }}>
            {summary.countsBySeverity.Low}
          </span>
        </div>
      </div>

      {/* Nearest and Farthest Affected Buildings */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {summary.nearestBuilding && (
          <div
            style={{
              padding: '8px 10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} color="#ef4444" />
              <span style={{ color: 'var(--text-secondary)' }}>Nearest:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{summary.nearestBuilding.entity.name}</strong>
            </div>
            <span style={{ fontWeight: 700, color: '#ef4444' }}>
              {summary.nearestBuilding.distanceKm} km
            </span>
          </div>
        )}

        {summary.farthestBuilding && (
          <div
            style={{
              padding: '8px 10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} color="#0284c7" />
              <span style={{ color: 'var(--text-secondary)' }}>Farthest:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{summary.farthestBuilding.entity.name}</strong>
            </div>
            <span style={{ fontWeight: 700, color: '#0284c7' }}>
              {summary.farthestBuilding.distanceKm} km
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
