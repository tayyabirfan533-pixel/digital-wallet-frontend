import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsView() {
  const [data, setData] = useState({ total_sent: 0, total_received: 0, total_transactions: 0, wallet_balance: 0 });

  useEffect(() => {
    api.getAnalytics().then(res => setData(res.data)).catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '14px', borderRadius: '16px' }}><BarChart3 size={30}/></div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc' }}>Transaction Analytics</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Aggregated financial metrics and account performance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}><span>Balance</span><DollarSign size={18} color="#34d399"/></div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#34d399' }}>${data.wallet_balance.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}><span>Total Sent</span><TrendingUp size={18} color="#f43f5e"/></div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>${data.total_sent.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}><span>Total Received</span><TrendingUp size={18} color="#22d3ee"/></div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>${data.total_received.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}><span>Total Volume</span><Activity size={18} color="#c084fc"/></div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc' }}>{data.total_transactions} Txs</div>
        </div>
      </div>
    </div>
  );
}