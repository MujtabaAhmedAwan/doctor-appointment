import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const slides = [
  { 
    emoji: '🏥', 
    title: 'Your Health,\nSimplified', 
    body: 'Connect with 500+ verified specialists across 30+ departments — all from your phone.',
    bg: '#EFF6FF'
  },
  { 
    emoji: '📅', 
    title: 'Book in\n60 Seconds', 
    body: 'Pick your preferred time slot, choose in-person or video — and you\'re confirmed instantly.',
    bg: '#F0FDF4'
  },
  { 
    emoji: '📋', 
    title: 'Track Every\nVisit', 
    body: 'Your complete medical history, appointments, and prescriptions — organized and always accessible.',
    bg: '#FDF4FF'
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const s = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else navigate('/auth');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, background: s.bg }} 
      transition={{ duration: 0.5 }}
      style={{
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={step} 
            initial={{ scale: 0.5, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ fontSize: '96px', marginBottom: '32px' }}
          >
            {s.emoji}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1 
            key={`t${step}`} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: '32px', 
              textAlign: 'center', 
              lineHeight: 1.15, 
              whiteSpace: 'pre-line', 
              marginBottom: '16px' 
            }}
          >
            {s.title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p 
            key={`b${step}`} 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.65, textAlign: 'center', maxWidth: '280px' }}
          >
            {s.body}
          </motion.p>
        </AnimatePresence>
      </div>

      <div style={{ padding: '0 32px 48px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                width: i === step ? 24 : 8, 
                background: i === step ? 'var(--color-primary)' : 'var(--color-border)' 
              }}
              style={{ height: '8px', borderRadius: '4px', transition: 'all 0.3s' }}
            />
          ))}
        </div>
        
        <Button onClick={handleNext}>
          {step < slides.length - 1 ? 'Continue →' : 'Get Started'}
        </Button>
        
        {step < slides.length - 1 ? (
          <button onClick={() => navigate('/auth')} style={{ color: 'var(--color-text-faint)', fontSize: '14px', fontWeight: 600 }}>
            Skip
          </button>
        ) : (
          <div style={{ height: '21px' }} /> // Placeholder to prevent jump
        )}
      </div>
    </motion.div>
  );
}
