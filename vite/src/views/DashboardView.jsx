import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Wallet, ArrowUpRight, ArrowDownLeft, Sparkles, Send } from 'lucide-react';

export default function DashboardView({ setActiveTab }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_sent: 0, total_received: 0, total_transactions: 0 });
  const [recentTxs, setRecentTxs] = useState([]);

  useEffect(() => {
    api.getAnalytics().then(res => setStats(res.data)).catch(console.error);
    api.getTransactions(1, 5, "All").then(res => setRecentTxs(res.data.transactions)).catch(console.error);
  }, [user?.balance]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(52, 211, 153, 0.2)',
        borderRadius: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), #0f172a, rgba(8, 51, 68, 0.4))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
            <Sparkles size={16}/>
            <span>Digital Wallet & Transaction System</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>Welcome back, @{user?.username}!</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>Manage your funds, transfer instantly, and view live ledger status.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('wallet')} style={{ backgroundColor: '#34d399', color: '#030712', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={18}/><span>Deposit</span>
          </button>
          <button onClick={() => setActiveTab('transfer')} style={{ backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18}/><span>Transfer</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Available Balance</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#34d399' }}>${user?.balance?.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Total Sent</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>${stats.total_sent?.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Total Received</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>${stats.total_received?.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Total Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>{stats.total_transactions}</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>Recent Transactions</h3>
          <button onClick={() => setActiveTab('history')} style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>View All →</button>
        </div>

        {recentTxs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No transactions recorded yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTxs.map(tx => (
              <div key={tx.id} style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: tx.type === 'Deposit' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(52, 211, 153, 0.1)', color: tx.type === 'Deposit' ? '#22d3ee' : '#34d399' }}>
                    {tx.type === 'Deposit' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#f8fafc' }}>{tx.type}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(tx.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', color: '#34d399', fontSize: '16px' }}>${tx.amount.toFixed(2)}</div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}