import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, User, Check, X, Trash2 } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { supabase } from '../utils/supabase';
import { getAppointmentsByDoctor, updateAppointmentStatus, deleteAppointment } from '../utils/mockDb';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({ name: 'Doctor', specialty: 'Specialist', timing: '', initials: 'DR', id: null });
  const [activeTab, setActiveTab] = useState('requests'); // requests, confirmed, cancelled
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.full_name || 'Doctor';
      setDoctorInfo({
        name,
        specialty: meta.specialty || 'General',
        timing: meta.timing || 'Standard Hours',
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        id: user.id
      });
      
      const appts = getAppointmentsByDoctor(user.id);
      setAppointments(appts);
    }
  };

  const handleAction = (id, action) => {
    if (action === 'accept') {
      updateAppointmentStatus(id, 'Confirmed');
    } else if (action === 'decline' || action === 'cancel') {
      updateAppointmentStatus(id, 'Cancelled');
    } else if (action === 'delete') {
      deleteAppointment(id);
    }
    
    // Refresh
    if (doctorInfo.id) {
      setAppointments(getAppointmentsByDoctor(doctorInfo.id));
    }
  };

  const pendingReqs = appointments.filter(a => a.status === 'Pending');
  const confirmedReqs = appointments.filter(a => a.status === 'Confirmed');
  const cancelledReqs = appointments.filter(a => a.status === 'Cancelled');

  const displayedAppointments = activeTab === 'requests' ? pendingReqs : 
                                activeTab === 'confirmed' ? confirmedReqs : cancelledReqs;

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
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '4px 0 0' }}>{doctorInfo.name}</h2>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '4px' }}>{doctorInfo.specialty}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '2px' }}>Timing: {doctorInfo.timing}</div>
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
              <Avatar initials={doctorInfo.initials} color="var(--color-accent-dark)" size={42} />
            </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{pendingReqs.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>New Requests</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{confirmedReqs.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>Confirmed</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: '16px', padding: '6px' }}>
          {['requests', 'confirmed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '10px 0', fontSize: '13px', fontWeight: 700, borderRadius: '12px',
                background: activeTab === tab ? 'var(--color-accent)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--color-text-faint)',
                border: 'none', cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div style={{ padding: '0 20px', flex: 1 }}>
        <AnimatePresence mode="popLayout">
          {displayedAppointments.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} color="var(--color-text-faint)" />
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>No {activeTab} appointments.</p>
            </motion.div>
          )}

          {displayedAppointments.map((req, i) => (
            <motion.div 
              key={req.id} 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
              style={{
                background: '#fff', borderRadius: '20px', padding: '20px',
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <Avatar initials={req.patient.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()} color="#3B82F6" size={52} />
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

              {activeTab === 'requests' && (
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
              )}

              {activeTab === 'confirmed' && (
                <Button 
                  style={{ width: '100%', padding: '12px', fontSize: '14px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: 'none', boxShadow: 'none' }}
                  onClick={() => handleAction(req.id, 'cancel')}
                >
                  <X size={18} /> Cancel Appointment
                </Button>
              )}

              {activeTab === 'cancelled' && (
                <Button 
                  style={{ width: '100%', padding: '12px', fontSize: '14px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: 'none', boxShadow: 'none' }}
                  onClick={() => handleAction(req.id, 'delete')}
                >
                  <Trash2 size={18} /> Delete Record
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
