import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Wallet, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function WalletView() {
  const { user, refreshUser, addNotification } = useAuth();
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);
    try {
      await api.deposit(parseFloat(amount));
      await refreshUser();
      setSuccess(`Successfully deposited $${parseFloat(amount).toFixed(2)}!`);
      addNotification(`Deposited $${parseFloat(amount).toFixed(2)} successfully.`);
      setAmount('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '12px', borderRadius: '16px' }}>
            <Wallet size={30}/>
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc' }}>Wallet & Demo Deposit</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Add funds instantly to test transfers and balances.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Current Balance</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>${user?.balance?.toFixed(2)}</div>
          </div>
        </div>

        {success && (
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18}/><span>{success}</span>
          </div>
        )}

        <form onSubmit={handleDeposit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '14px', color: '#f8fafc', fontSize: '15px', outline: 'none' }}
              placeholder="100.00"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            {[50, 100, 500, 1000].map((val) => (
              <button key={val} type="button" onClick={() => setAmount(val.toString())} style={{ padding: '8px 16px', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: '1px solid #334155', cursor: 'pointer' }}>
                +${val}
              </button>
            ))}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#34d399', color: '#030712', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18}/>
            <span>{loading ? 'Processing...' : 'Confirm Deposit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}