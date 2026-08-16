import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Stars from '../components/ui/Stars';
import { SPECIALTIES, DOCTORS, INSIGHTS } from '../utils/data';

export default function Dashboard() {
  const navigate = useNavigate();
  const [insightIdx, setInsightIdx] = useState(0);
  const insight = INSIGHTS[insightIdx];

  useEffect(() => {
    const t = setInterval(() => setInsightIdx(i => (i + 1) % INSIGHTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const openDoctor = (id) => navigate(`/doctor/${id}`);

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: '100px' }}>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          padding: '48px 20px 32px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: 0, fontWeight: 500 }}>Developed by</p>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>Malik M Mujtaba Ahmed Ali Awan</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              style={{
                background: 'rgba(255,255,255,0.2)', width: '42px', height: '42px',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Bell size={20} color="#fff" />
            </motion.button>
            <Avatar initials="MM" color="var(--color-primary-dark)" size={42} />
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '24px' }}>
          {[
            ['Doctors', '500+'],
            ['Specialties', '30+'],
            ['Patients', '50K+']
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', gap: '12px', alignItems: 'center', background: '#fff',
            borderRadius: '16px', padding: '14px 16px', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)', cursor: 'text'
          }}
          onClick={() => navigate('/doctors')}
        >
          <Search size={20} color="var(--color-text-faint)" />
          <span style={{ color: 'var(--color-text-faint)', fontSize: '15px' }}>Search doctors, specialties...</span>
        </motion.div>

        {/* Browse by Specialty */}
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 16px' }}>Browse by Specialty</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {SPECIALTIES.map((sp, idx) => (
              <motion.div 
                key={sp.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate('/doctors')}
                style={{
                  background: sp.color, borderRadius: '16px', padding: '16px 8px',
                  textAlign: 'center', cursor: 'pointer', border: `1px solid ${sp.accent}22`
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{sp.emoji}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: sp.accent, lineHeight: 1.2 }}>{sp.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Available Now */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Available Now</h3>
            <span onClick={() => navigate('/doctors')} style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>See all</span>
          </div>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', margin: '0 -20px', padding: '0 20px 12px' }}>
            {DOCTORS.filter(d => d.available).map((doc, idx) => (
              <motion.div 
                key={doc.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileTap={{ scale: 0.97 }} 
                onClick={() => openDoctor(doc.id)}
                style={{
                  minWidth: '220px', background: '#fff', borderRadius: '20px', padding: '18px',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer', border: '1px solid var(--color-border)', flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <Avatar initials={doc.img} color={doc.color} size={48} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.3 }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-faint)' }}>{doc.specialty}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                  <Stars rating={doc.rating} />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{doc.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700 }}>Available Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Wellness Insight */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={insightIdx} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-light), rgba(16,185,129,0.1))',
              borderRadius: '20px', padding: '24px', border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{insight.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-accent-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Daily Wellness Insight</span>
            </div>
            <p style={{ fontSize: '15px', color: '#065F46', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{insight.tip}</p>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
