import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Building2 } from 'lucide-react';
import type { Building, AffectedEntity } from '../../api/types';

interface AffectedBuildingsTableProps {
  affectedBuildings: AffectedEntity<Building>[];
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string) => void;
}

type SortField = 'distance' | 'name' | 'severity' | 'pga';

const SEVERITY_WEIGHTS: Record<string, number> = {
  Severe: 4,
  High: 3,
  Moderate: 2,
  Low: 1,
  None: 0,
};

export const AffectedBuildingsTable: React.FC<AffectedBuildingsTableProps> = ({
  affectedBuildings,
  selectedBuildingId,
  onSelectBuilding,
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('distance');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSorted = useMemo(() => {
    const list = affectedBuildings.filter(
      (item) =>
        item.entity.name.toLowerCase().includes(search.toLowerCase()) ||
        item.entity.id.toLowerCase().includes(search.toLowerCase()) ||
        (item.entity.zoneId && item.entity.zoneId.toLowerCase().includes(search.toLowerCase()))
    );

    return list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'distance') {
        cmp = a.distanceKm - b.distanceKm;
      } else if (sortField === 'name') {
        cmp = a.entity.name.localeCompare(b.entity.name);
      } else if (sortField === 'severity') {
        cmp = (SEVERITY_WEIGHTS[b.severity] || 0) - (SEVERITY_WEIGHTS[a.severity] || 0);
      } else if (sortField === 'pga') {
        cmp = (b.estimatedPgaG || 0) - (a.estimatedPgaG || 0);
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [affectedBuildings, search, sortField, sortAsc]);

  return (
    <div className="ui-card">
      <div className="card-title" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} />
          <span>Affected Structures ({filteredAndSorted.length})</span>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <Search
          size={14}
          style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Filter by building name or zone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: '32px' }}
        />
      </div>

      {/* Table */}
      <div className="affected-table-container">
        <table className="affected-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Building
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th onClick={() => handleSort('distance')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Dist (km)
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th onClick={() => handleSort('pga')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  PGA (g)
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th onClick={() => handleSort('severity')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Severity
                  <ArrowUpDown size={11} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No buildings match the filter.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map(({ entity, distanceKm, severity, estimatedPgaG }) => {
                const isSelected = entity.id === selectedBuildingId;
                return (
                  <tr
                    key={entity.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => onSelectBuilding(entity.id)}
                    title="Click to locate on map"
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{entity.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {entity.zoneId || 'Zone'} • {entity.properties.type || 'RC'}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{distanceKm}</td>
                    <td style={{ fontWeight: 600, color: (estimatedPgaG || 0) >= entity.properties.damageThresholdG ? '#ef4444' : '#10b981' }}>
                      {estimatedPgaG !== undefined ? `${estimatedPgaG}g` : '—'}
                    </td>
                    <td>
                      <span className={`severity-badge severity-${severity}`}>
                        {severity}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
