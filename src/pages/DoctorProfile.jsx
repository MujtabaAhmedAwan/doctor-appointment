import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar as CalendarIcon, MapPin, CheckCircle2 } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Stars from '../components/ui/Stars';
import Button from '../components/ui/Button';
import { DOCTORS } from '../utils/data';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');
  
  const doctor = DOCTORS.find(d => d.id === parseInt(id));
  if (!doctor) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.35 }}
      style={{ overflowY: 'auto', height: '100%', paddingBottom: '120px' }}
    >
      {/* Header Profile Section */}
      <div style={{
        background: `linear-gradient(135deg, ${doctor.color}, ${doctor.color}dd)`,
        padding: '56px 20px 40px',
        position: 'relative',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: `0 10px 30px ${doctor.color}30`
      }}>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={() => navigate(-1)} 
          style={{
            background: 'rgba(255,255,255,0.25)', 
            borderRadius: '12px',
            padding: '10px 14px', 
            color: '#fff', 
            fontSize: '14px', 
            fontWeight: 700, 
            marginBottom: '24px',
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Avatar initials={doctor.img} color="rgba(255,255,255,0.2)" size={84} />
          <div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>{doctor.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: '6px 0 10px' }}>
              {doctor.specialty} · {doctor.exp} experience
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stars rating={doctor.rating} />
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <Button variant="outline" style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.2)', 
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#fff' 
          }}>
            <Phone size={18} /> Call Clinic
          </Button>
          <Button 
            style={{ flex: 1, background: '#fff', color: doctor.color, boxShadow: `0 8px 24px ${doctor.color}50` }}
            onClick={() => navigate(`/book/${doctor.id}`)}
          >
            <CalendarIcon size={18} /> Book Now
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--color-border)', 
        background: '#fff', 
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {['info', 'schedule', 'services', 'reviews'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            style={{
              flex: 1, padding: '16px 4px', fontSize: '14px', fontWeight: 700,
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-faint)',
              borderBottom: `2.5px solid ${tab === t ? 'var(--color-primary)' : 'transparent'}`,
              textTransform: 'capitalize',
              transition: 'color 0.2s'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '24px 20px' }}>
        <AnimatePresence mode="wait">
          {tab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 12px' }}>About</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>
                  {doctor.name} is a highly experienced {doctor.specialty} with {doctor.exp} of clinical practice.
                  Specializing in advanced diagnostics and patient-centric care, they provide state-of-the-art treatments.
                </p>
              </div>
              <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 16px' }}>Clinic Location</h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: `${doctor.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={24} color={doctor.color} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{doctor.location}</span>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const active = doctor.days.includes(day);
                return (
                  <motion.div 
                    key={day} 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px', background: '#fff', borderRadius: '16px', marginBottom: '10px',
                      border: `1px solid ${active ? doctor.color + '40' : 'var(--color-border)'}`,
                      opacity: active ? 1 : 0.6
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 700, color: active ? 'var(--color-text)' : 'var(--color-text-faint)' }}>{day}</span>
                    <span style={{ fontSize: '13px', color: active ? doctor.color : 'var(--color-text-faint)', fontWeight: 700 }}>
                      {active ? '9:00 AM – 5:00 PM' : 'Not Available'}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {tab === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {doctor.services.map((sv, idx) => (
                <motion.div 
                  key={sv} 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                  style={{
                    display: 'flex', gap: '14px', alignItems: 'center', padding: '16px 20px',
                    background: '#fff', borderRadius: '16px', marginBottom: '10px', border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ 
                    width: '36px', height: '36px', background: `${doctor.color}15`, borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    <CheckCircle2 size={18} color={doctor.color} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>{sv}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {['Excellent care, very compassionate and professional.', 'Wait time was short, and the diagnosis was spot on.', 'Highly recommend to anyone looking for a reliable specialist.'].map((rev, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '14px', border: '1px solid var(--color-border)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Avatar initials={['JD', 'AS', 'MR'][i]} color={['#0EA5E9', '#8B5CF6', '#22C55E'][i]} size={36} />
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text)' }}>Patient {i+1}</span>
                    </div>
                    <Stars rating={5} />
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>{rev}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
