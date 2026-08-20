import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, CircleHelp, Shield } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { supabase } from '../utils/supabase';

export default function Profile() {
  const navigate = useNavigate();

  const options = [
    { icon: Settings, label: 'Account Settings' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: CircleHelp, label: 'Help & Support' },
  ];

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: '100px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Profile Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        padding: '56px 20px 40px',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-block', position: 'relative', marginBottom: '16px' }}>
          <Avatar initials="MM" color="var(--color-primary-dark)" size={96} style={{ border: '4px solid rgba(255,255,255,0.3)' }} />
          <div style={{ 
            position: 'absolute', bottom: 4, right: 4, width: '20px', height: '20px', 
            borderRadius: '50%', background: 'var(--color-accent)', border: '3px solid #0284C7' 
          }} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>Malik Muhammad Mujtaba Ahmed Ali Awan</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0 }}>mujtaba@example.com</p>
      </div>

      <div style={{ padding: '32px 20px' }}>
        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/auth');
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '16px', borderRadius: '16px', background: 'var(--color-danger-light)',
              color: 'var(--color-danger)', border: 'none',
              fontSize: '15px', fontWeight: 700
            }}
          >
            <LogOut size={18} /> Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  );
}
