import React from 'react';

export default function Badge({ status, className = '' }) {
  const map = {
    Confirmed: { bg: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' },
    Pending:   { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Completed: { bg: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' },
    Cancelled: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  };
  
  const s = map[status] || map.Pending;
  
  return (
    <span 
      className={`badge ${className}`}
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        display: 'inline-flex',
        alignItems: 'center',
        letterSpacing: '0.03em',
        textTransform: 'uppercase'
      }}
    >
      {status}
    </span>
  );
}
