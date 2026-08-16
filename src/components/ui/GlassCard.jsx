import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', onClick, style = {}, animate = false, ...props }) {
  const cardStyle = {
    padding: '20px',
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    ...style
  };

  if (onClick) {
    cardStyle.cursor = 'pointer';
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={className}
        style={cardStyle}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
        style={cardStyle}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} style={cardStyle} {...props}>
      {children}
    </div>
  );
}
