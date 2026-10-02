import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, ArrowRightLeft, History, Bell, Shield, BarChart3 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, notifications } = useAuth();
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet & Deposit', icon: Wallet },
    { id: 'transfer', label: 'Transfer Money', icon: ArrowRightLeft },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (user?.role === 'admin') items.push({ id: 'admin', label: 'Admin Control', icon: Shield });

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      borderRight: '1px solid #1e293b',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', padding: '0 12px 8px', textTransform: 'uppercase' }}>Navigation</div>
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'none',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
                color: isActive ? '#34d399' : '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <Icon size={18}/>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', fontSize: '12px', color: '#94a3b8' }}>
        <div style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>Sandbox Status</div>
        <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span>
          <span>Online (LocalStorage)</span>
        </div>
      </div>
    </aside>
  );
}