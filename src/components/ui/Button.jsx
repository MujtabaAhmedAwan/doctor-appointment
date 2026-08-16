import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ children, onClick, variant = 'primary', style = {}, className = '', ...props }) {
  const baseStyle = {
    padding: '14px 20px',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    transition: 'all 0.2s ease',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
      color: '#fff',
      boxShadow: 'var(--shadow-primary)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-text)',
      border: '1.5px solid var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
