import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header style={{
      backgroundColor: '#0f172a',
      borderBottom: '1px solid #1e293b',
      height: '70px',
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: '900', color: '#34d399' }}>
        <div style={{ backgroundColor: '#10b981', color: '#030712', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wallet size={20}/>
        </div>
        <span>PayVault</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', color: '#34d399' }}>
          Balance: ${user.balance?.toFixed(2)}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>@{user.username}</div>
          <div style={{ fontSize: '11px', color: '#34d399', textTransform: 'uppercase' }}>{user.role}</div>
        </div>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '10px' }}
          title="Logout"
        >
          <LogOut size={18}/>
        </button>
      </div>
    </header>
  );
}