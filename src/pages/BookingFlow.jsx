import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Video, User } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { DOCTORS, MY_APPOINTMENTS } from '../utils/data';

export default function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS.find(d => d.id === parseInt(id));
  
  const [type, setType] = useState('inperson'); // inperson | video
  const [selDate, setSelDate] = useState(0); // index of days
  const [selTime, setSelTime] = useState('');
  const [booked, setBooked] = useState(false);

  if (!doctor) return null;

  const today = new Date();
  const daysList = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const TIME_SLOTS_AM = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const TIME_SLOTS_PM = ['1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '4:00 PM', '4:30 PM'];

  const handleBook = () => {
    if (selTime) {
      setBooked(true);
      const dayName = dayNames[daysList[selDate].getDay()];
      const monthName = monthNames[daysList[selDate].getMonth()];
      const dateNum = daysList[selDate].getDate();
      
      const newBooking = {
        id: Date.now(), // Generate unique ID
        doctor: doctor.name,
        specialty: doctor.specialty,
        date: `${dayName}, ${monthName} ${dateNum} @ ${selTime}`,
        status: 'Confirmed',
        type: type === 'video' ? 'Video' : 'In-person',
        color: doctor.color,
        img: doctor.img
      };
      
      MY_APPOINTMENTS.unshift(newBooking);
    }
  };

  if (booked) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          style={{
            width: '96px', height: '96px', background: 'var(--color-accent-light)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(16,185,129,0.2)'
          }}
        >
          <CalendarIcon size={40} color="var(--color-accent-dark)" />
        </motion.div>
        
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '12px' }}>Appointment Confirmed!</h2>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Your <strong style={{ color: 'var(--color-text)' }}>{type === 'video' ? 'Video' : 'In-person'} Consultation</strong> with<br/>
          <strong style={{ color: doctor.color }}>{doctor.name}</strong> is scheduled for<br/>
          <strong style={{ color: 'var(--color-text)' }}>{dayNames[daysList[selDate].getDay()]}, {monthNames[daysList[selDate].getMonth()]} {daysList[selDate].getDate()} at {selTime}</strong>.
        </p>
        
        <Button onClick={() => navigate('/visits')}>
          View My Appointments
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '24px 20px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px', background: 'var(--color-background)', borderRadius: '12px' }}>
            <ArrowLeft size={20} color="var(--color-text)" />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>Book Appointment</h2>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', paddingBottom: '120px' }}>
        
        {/* Doctor Summary */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
          <Avatar initials={doctor.img} color={doctor.color} size={64} />
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>{doctor.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{doctor.specialty}</div>
          </div>
        </div>

        {/* Consultation Type */}
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>Consultation Type</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          {[
            { id: 'inperson', label: 'In-person', icon: User },
            { id: 'video', label: 'Video Call', icon: Video }
          ].map(t => {
            const Icon = t.icon;
            const active = type === t.id;
            return (
              <motion.button 
                key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setType(t.id)}
                style={{
                  flex: 1, padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  background: active ? `${doctor.color}15` : '#fff',
                  border: `2px solid ${active ? doctor.color : 'var(--color-border)'}`,
                  color: active ? doctor.color : 'var(--color-text-faint)'
                }}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: active ? doctor.color : 'var(--color-text-muted)' }}>{t.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Date Selection */}
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>Select Date</h3>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px', marginBottom: '16px' }}>
          {daysList.map((d, i) => {
            const dayName = dayNames[d.getDay()];
            const isAvail = doctor.days.includes(dayName);
            const active = selDate === i;
            return (
              <motion.button 
                key={i} whileTap={{ scale: isAvail ? 0.92 : 1 }}
                onClick={() => isAvail && setSelDate(i)}
                style={{
                  minWidth: '70px', padding: '16px 10px', borderRadius: '20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  background: active ? doctor.color : '#fff',
                  border: `1.5px solid ${active ? doctor.color : 'var(--color-border)'}`,
                  opacity: isAvail ? 1 : 0.4,
                  cursor: isAvail ? 'pointer' : 'not-allowed',
                  boxShadow: active ? `0 8px 20px ${doctor.color}40` : 'none'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: active ? '#fff' : 'var(--color-text-muted)' }}>{dayName}</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: active ? '#fff' : 'var(--color-text)' }}>{d.getDate()}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Time Selection */}
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>Available Slots</h3>
        
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px' }}>Morning</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {TIME_SLOTS_AM.map(t => (
            <motion.button 
              key={t} whileTap={{ scale: 0.95 }} onClick={() => setSelTime(t)}
              style={{
                padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                background: selTime === t ? doctor.color : '#fff',
                color: selTime === t ? '#fff' : 'var(--color-text)',
                border: `1px solid ${selTime === t ? doctor.color : 'var(--color-border)'}`,
              }}
            >
              {t}
            </motion.button>
          ))}
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px' }}>Afternoon</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {TIME_SLOTS_PM.map(t => (
            <motion.button 
              key={t} whileTap={{ scale: 0.95 }} onClick={() => setSelTime(t)}
              style={{
                padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                background: selTime === t ? doctor.color : '#fff',
                color: selTime === t ? '#fff' : 'var(--color-text)',
                border: `1px solid ${selTime === t ? doctor.color : 'var(--color-border)'}`,
              }}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Fee</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>Rs.{doctor.price}</div>
        </div>
        <Button 
          onClick={handleBook}
          style={{ opacity: selTime ? 1 : 0.5, cursor: selTime ? 'pointer' : 'not-allowed', background: doctor.color, boxShadow: `0 8px 24px ${doctor.color}50` }}
        >
          Confirm Booking
        </Button>
      </div>
    </motion.div>
  );
}
