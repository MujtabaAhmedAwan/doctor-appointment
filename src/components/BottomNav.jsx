import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.substring(1) || 'home';

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'doctors', label: 'Doctors', icon: Search, path: '/doctors' },
    { id: 'visits', label: 'Visits', icon: Calendar, path: '/visits' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  // Hide nav on onboarding and auth
  if (['onboarding', 'auth'].includes(active)) return null;

  return (
    <motion.nav
      initial={{ y: 80 }} 
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
      style={{
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)', 
        display: 'flex',
        padding: '8px 0',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = active.startsWith(t.id);
        
        return (
          <button 
            key={t.id} 
            onClick={() => navigate(t.path)} 
            style={{
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '4px 0',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-faint)',
              position: 'relative'
            }}
          >
            <motion.div whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
            {isActive && (
              <motion.div 
                layoutId="navDot" 
                style={{
                  position: 'absolute', 
                  bottom: '0px', 
                  width: '4px', 
                  height: '4px',
                  borderRadius: '50%', 
                  background: 'var(--color-primary)',
                }}
              />
            )}
          </button>
        );
      })}
    </motion.nav>
  );
}
