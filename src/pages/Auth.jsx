import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('patient'); // patient | doctor
  const navigate = useNavigate();
  
  const inputStyle = {
    width: '100%',
    padding: '16px 18px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '14px',
    fontSize: '15px',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: 'var(--color-text)',
    transition: 'border-color 0.2s',
  };

  const handleAuth = () => {
    navigate('/home');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', overflowY: 'auto' }}
    >
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        padding: '64px 24px 48px',
        textAlign: 'center',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)'
      }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '24px', marginBottom: '16px' }}>
          <Activity size={36} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ color: '#fff', fontSize: '28px', margin: 0 }}>MediConnect</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginTop: '8px' }}>Your premium health companion</p>
      </div>

      <div style={{ flex: 1, padding: '32px 24px 40px', marginTop: '-24px' }}>
        <div style={{ 
          display: 'flex', 
          background: 'var(--color-surface)', 
          borderRadius: '16px', 
          padding: '6px', 
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {['login', 'signup'].map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m)} 
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                background: mode === m ? 'var(--color-primary-transparent)' : 'transparent', 
                color: mode === m ? 'var(--color-primary)' : 'var(--color-text-faint)',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <input placeholder="Full Name" style={inputStyle} />
              </motion.div>
            )}
          </AnimatePresence>
          <input placeholder="Email address" type="email" style={inputStyle} />
          
          <div style={{ position: 'relative' }}>
            <input placeholder="Password" type={showPw ? 'text' : 'password'} style={inputStyle} />
            <button 
              onClick={() => setShowPw(!showPw)} 
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-faint)', display: 'flex',
              }}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button onClick={handleAuth} style={{ marginTop: '12px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            {role === 'patient' ? 'Are you a doctor? ' : 'Are you a patient? '}
          </span>
          <button 
            onClick={() => setRole(r => r === 'patient' ? 'doctor' : 'patient')} 
            style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700 }}
          >
            {role === 'patient' ? 'Register as Doctor' : 'Switch to Patient'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
