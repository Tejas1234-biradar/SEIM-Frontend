import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        color: '#fca5a5',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
        <AlertCircle size={16} color="#ef4444" />
        <span>{title}</span>
      </div>
      <p style={{ fontSize: '12px', margin: 0, color: '#fecaca', lineHeight: 1.4 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start', marginTop: '4px' }}
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
    </div>
  );
};
