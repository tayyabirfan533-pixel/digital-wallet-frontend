import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationsView() {
  const { notifications } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '12px', borderRadius: '16px' }}><Bell size={26}/></div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc' }}>Notifications</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Real-time alerts and activity logs.</p>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
          {notifications.length} Alerts
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '16px' }}>
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '8px', borderRadius: '10px', marginTop: '2px' }}><CheckCircle2 size={18}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#f8fafc', fontWeight: '500', fontSize: '14px' }}>{n.message}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}