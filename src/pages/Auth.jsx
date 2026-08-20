import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../utils/supabase';
import { SPECIALTIES } from '../utils/data';
import { registerCustomDoctor } from '../utils/mockDb';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('patient'); // patient | doctor
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [timing, setTiming] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              specialty: role === 'doctor' ? specialty : null,
              timing: role === 'doctor' ? timing : null
            }
          }
        });
        if (error) throw error;
        // If email confirmation is off or successful, user might be logged in
        if (data.session) {
          const userRole = data.user.user_metadata?.role || 'patient';
          if (userRole === 'doctor') {
            registerCustomDoctor({
              id: data.user.id,
              name: fullName,
              specialty: specialty || 'General',
              timing: timing || 'Standard',
              rating: 0, reviews: 0, exp: "New", available: true, price: 1500,
              img: fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
              color: "#0EA5E9", location: "Online", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], services: ["Consultation"]
            });
            navigate('/doctor-dashboard');
          } else {
            navigate('/home');
          }
        } else {
          setError('Account created! Please check your email to verify (or try logging in if verification is off).');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        const userRole = data.user.user_metadata?.role || 'patient';
        if (userRole === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              onClick={() => { setMode(m); setError(null); }} 
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
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle} 
                />
                
                {role === 'doctor' && (
                  <>
                    <select 
                      value={specialty} 
                      onChange={(e) => setSpecialty(e.target.value)} 
                      style={inputStyle}
                    >
                      <option value="" disabled>Select Specialty</option>
                      {SPECIALTIES.map(s => (
                        <option key={s.id} value={s.name}>{s.emoji} {s.name}</option>
                      ))}
                    </select>

                    <input 
                      placeholder="e.g. Mon-Fri, 9:00 AM - 5:00 PM" 
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      style={inputStyle} 
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <input 
            placeholder="Email address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
          />
          
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="Password" 
              type={showPw ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle} 
            />
            <button 
              onClick={() => setShowPw(!showPw)} 
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-faint)', display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer'
              }}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '13px', textAlign: 'center', marginTop: '4px' }}>
              {error}
            </div>
          )}

          <Button onClick={handleAuth} style={{ marginTop: '12px' }} disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            {role === 'patient' ? 'Are you a doctor? ' : 'Are you a patient? '}
          </span>
          <button 
            onClick={() => setRole(r => r === 'patient' ? 'doctor' : 'patient')} 
            style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            {role === 'patient' ? 'Register as Doctor' : 'Switch to Patient'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
