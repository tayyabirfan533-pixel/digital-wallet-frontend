import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRightLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TransferView() {
  const { user, refreshUser, addNotification } = useAuth();
  const [recipient, setRecipient] = useState('johndoe');
  const [amount, setAmount] = useState('50');
  const [idempotencyKey, setIdempotencyKey] = useState('tx-' + Math.random().toString(36).substring(7));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      await api.transfer(recipient, parseFloat(amount), idempotencyKey);
      await refreshUser();
      setSuccess(`Successfully transferred $${parseFloat(amount).toFixed(2)} to @${recipient}!`);
      addNotification(`Transferred $${parseFloat(amount).toFixed(2)} to @${recipient}`);
      setRecipient('');
      setAmount('');
      setIdempotencyKey('tx-' + Math.random().toString(36).substring(7));
    } catch (err) {
      setError(err.response?.data?.detail || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '12px', borderRadius: '16px' }}>
            <ArrowRightLeft size={30}/>
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc' }}>User-to-User Transfer</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Protected with idempotency keys & balance validation.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <span style={{ color: '#94a3b8' }}>Your Balance:</span>
          <span style={{ fontWeight: '900', color: '#34d399', fontSize: '16px' }}>${user?.balance?.toFixed(2)}</span>
        </div>

        {success && <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18}/><span style={{ fontSize: '13px' }}>{success}</span></div>}
        {error && <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldAlert size={18}/><span style={{ fontSize: '13px' }}>{error}</span></div>}

        <form onSubmit={handleTransfer}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Recipient Username (e.g. johndoe)</label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '14px', color: '#f8fafc', fontSize: '15px', outline: 'none' }}
              placeholder="username"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '14px', color: '#f8fafc', fontSize: '15px', outline: 'none' }}
              placeholder="50.00"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Idempotency Key (Duplicate Protection)</label>
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '14px', color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#34d399', color: '#030712', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <ArrowRightLeft size={18}/>
            <span>{loading ? 'Executing...' : 'Transfer Funds'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}