import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

import Avatar from '../components/ui/Avatar';
import Stars from '../components/ui/Stars';
import Button from '../components/ui/Button';
import { DOCTORS } from '../utils/data';
import { getCustomDoctors } from '../utils/mockDb';

export default function SpecialistDirectory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selSpec, setSelSpec] = useState('All');
  
  const specs = ['All', 'Cardio', 'Neuro', 'Pediatric', 'Ortho', 'Derma', 'Eye'];

  const allDoctors = [...DOCTORS, ...getCustomDoctors()];

  const filtered = allDoctors.filter(d => 
    (selSpec === 'All' || d.specialty.toLowerCase().includes(selSpec.toLowerCase())) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: '100px' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        padding: '48px 20px 24px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px'
      }}>
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 20px' }}>Find Specialists</h2>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.2)',
          borderRadius: '16px', padding: '14px 16px', backdropFilter: 'blur(10px)'
        }}>
          <Search size={20} color="rgba(255,255,255,0.9)" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search doctors or specialty..."
            style={{
              background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '15px', flex: 1,
            }}
            className="search-input"
          />
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
          {specs.map(s => (
            <motion.button 
              key={s} 
              whileTap={{ scale: 0.93 }} 
              onClick={() => setSelSpec(s)} 
              style={{
                flexShrink: 0, padding: '8px 20px', borderRadius: '24px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                background: selSpec === s ? 'var(--color-primary)' : '#fff', 
                color: selSpec === s ? '#fff' : 'var(--color-text-muted)',
                boxShadow: selSpec === s ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                border: selSpec === s ? 'none' : '1px solid var(--color-border)',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((doc, i) => (
            <motion.div 
              key={doc.id} 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }} 
              onClick={() => navigate(`/doctor/${doc.id}`)}
              style={{
                background: '#fff', borderRadius: '20px', padding: '20px',
                boxShadow: 'var(--shadow-sm)', cursor: 'pointer', border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar initials={doc.img} color={doc.color} size={64} />
                  {doc.available && <div style={{ position: 'absolute', bottom: 2, right: 2, width: '14px', height: '14px', borderRadius: '50%', background: 'var(--color-accent)', border: '2px solid #fff' }} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)' }}>{doc.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{doc.specialty}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Stars rating={doc.rating} />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-faint)' }}>{doc.rating} ({doc.reviews})</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--color-text-faint)" /> {doc.location}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>Rs.{doc.price}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-faint)' }}>per visit</div>
                  </div>
                  <Button style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px', marginTop: '16px' }} onClick={(e) => { e.stopPropagation(); navigate(`/book/${doc.id}`); }}>
                    Book
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
