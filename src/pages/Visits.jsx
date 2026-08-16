import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Video, User } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const MY_APPOINTMENTS = [
  {id: 1, doctor: "Dr. Sarah Chen", specialty: "Cardiologist", date: "Fri, Aug 22 @ 9:45 AM", status: "Confirmed", type: "In-person", color: "#0EA5E9", img: "SC"},
  {id: 2, doctor: "Dr. Ahmed Malik", specialty: "Neurologist", date: "Wed, Sep 3 @ 2:00 PM", status: "Pending", type: "Video", color: "#8B5CF6", img: "AM"},
];

const MY_HISTORY = [
  {id: 3, doctor: "Dr. Priya Sharma", specialty: "Pediatrician", date: "Mon, Jul 14 @ 10:00 AM", status: "Completed", type: "In-person", color: "#22C55E", img: "PS"},
  {id: 4, doctor: "Dr. James Wilson", specialty: "Orthopedic", date: "Thu, Jun 26 @ 3:30 PM", status: "Completed", type: "In-person", color: "#F59E0B", img: "JW"},
];

export default function Visits() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState(MY_APPOINTMENTS);
  const list = tab === 'upcoming' ? upcoming : MY_HISTORY;

  const handleCancel = (id) => {
    setUpcoming(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: '100px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        padding: '48px 20px 24px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        flexShrink: 0
      }}>
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 20px' }}>My Appointments</h2>
        
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '6px' }}>
          {['upcoming', 'history'].map(t => (
            <button 
              key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--color-primary)' : 'rgba(255,255,255,0.8)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize', transition: 'all 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '24px 20px', flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={tab} 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {list.map((apt, i) => (
              <motion.div 
                key={apt.id} 
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{
                  background: '#fff', borderRadius: '20px', padding: '20px',
                  boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <Avatar initials={apt.img} color={apt.color} size={52} />
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>{apt.doctor}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{apt.specialty}</div>
                    </div>
                  </div>
                  <Badge status={apt.status} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--color-background)', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Calendar size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{apt.date.split('@')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {apt.type === 'Video' ? <Video size={16} color="var(--color-primary)" /> : <User size={16} color="var(--color-primary)" />}
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{apt.type}</span>
                  </div>
                </div>

                {tab === 'upcoming' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="outline" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>Reschedule</Button>
                    <Button 
                      style={{ flex: 1, padding: '10px', fontSize: '13px', background: 'var(--color-danger)', boxShadow: 'none' }}
                      onClick={() => handleCancel(apt.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                {tab === 'history' && (
                  <Button variant="outline" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>Book Again</Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
