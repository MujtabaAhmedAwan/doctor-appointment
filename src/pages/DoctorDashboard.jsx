import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, User, Check, X, Bell } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { INCOMING_REQUESTS } from '../utils/data';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(INCOMING_REQUESTS);
  
  const handleAction = (id, action) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: '100px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{
          background: 'linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))',
          padding: '48px 20px 32px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: 0, fontWeight: 500 }}>Doctor Portal</p>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>Dr. Mujtaba</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={() => navigate('/profile')}
              style={{
                background: 'rgba(255,255,255,0.2)', width: '42px', height: '42px',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none'
              }}
            >
              <Avatar initials="DM" color="var(--color-accent-dark)" size={42} />
            </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{requests.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>New Requests</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>4</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>Today's Appts</div>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <div style={{ padding: '0 20px', flex: 1 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 16px' }}>Incoming Requests</h3>
        
        <AnimatePresence>
          {requests.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} color="var(--color-text-faint)" />
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>All caught up! No pending requests.</p>
            </motion.div>
          )}

          {requests.map((req, i) => (
            <motion.div 
              key={req.id} 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
              style={{
                background: '#fff', borderRadius: '20px', padding: '20px',
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <Avatar initials={req.img} color={req.color} size={52} />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>{req.patient}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{req.reason}</div>
                  </div>
                </div>
                <Badge status={req.status} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--color-background)', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Calendar size={16} color="var(--color-accent)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{req.date.split('@')[0]}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {req.type === 'Video' ? <Video size={16} color="var(--color-accent)" /> : <User size={16} color="var(--color-accent)" />}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{req.type}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button 
                  style={{ flex: 1, padding: '12px', fontSize: '14px', background: 'var(--color-accent)', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
                  onClick={() => handleAction(req.id, 'accept')}
                >
                  <Check size={18} /> Accept
                </Button>
                <Button 
                  style={{ flex: 1, padding: '12px', fontSize: '14px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: 'none', boxShadow: 'none' }}
                  onClick={() => handleAction(req.id, 'decline')}
                >
                  <X size={18} /> Decline
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
