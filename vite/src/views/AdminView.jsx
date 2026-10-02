import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Shield, Users, Activity } from 'lucide-react';

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.adminGetUsers(), api.adminGetTransactions()])
      .then(([uRes, tRes]) => {
        setUsers(uRes.data);
        setTransactions(tRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading admin panel...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ backgroundColor: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', padding: '14px', borderRadius: '16px' }}><Shield size={30}/></div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc' }}>Admin Control Panel</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>System users and global ledger overview.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Users size={20} color="#34d399"/><h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>Registered Users ({users.length})</h3></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '14px' }}>ID</th><th style={{ padding: '14px' }}>Username</th><th style={{ padding: '14px' }}>Email</th><th style={{ padding: '14px' }}>Role</th><th style={{ padding: '14px' }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                  <td style={{ padding: '14px', fontFamily: 'monospace', color: '#94a3b8' }}>#{u.id}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#f8fafc' }}>@{u.username}</td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>{u.email}</td>
                  <td style={{ padding: '14px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.2)' }}>{u.role}</span></td>
                  <td style={{ padding: '14px', fontWeight: '900', color: '#34d399' }}>${u.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Activity size={20} color="#22d3ee"/><h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>Global Ledger ({transactions.length})</h3></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '14px' }}>ID</th><th style={{ padding: '14px' }}>Type</th><th style={{ padding: '14px' }}>Sender</th><th style={{ padding: '14px' }}>Recipient</th><th style={{ padding: '14px' }}>Amount</th><th style={{ padding: '14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                  <td style={{ padding: '14px', fontFamily: 'monospace', color: '#94a3b8' }}>#{tx.id}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#f8fafc' }}>{tx.type}</td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>@{tx.sender}</td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>@{tx.recipient}</td>
                  <td style={{ padding: '14px', fontWeight: '900', color: '#34d399' }}>${tx.amount.toFixed(2)}</td>
                  <td style={{ padding: '14px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}