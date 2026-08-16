import React from 'react';

export default function Avatar({ initials, color = '#0EA5E9', size = 42, className = '' }) {
  return (
    <div 
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}dd, ${color})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
        letterSpacing: '0.02em',
        boxShadow: `0 4px 10px ${color}40`
      }}
    >
      {initials}
    </div>
  );
}
