import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { History as HistoryIcon, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoryView() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const res = await api.getTransactions(page, limit, statusFilter);
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [page, statusFilter]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '12px', borderRadius: '16px' }}><HistoryIcon size={26}/></div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc' }}>Transaction History</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Ledger with filtering and pagination.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#030712', border: '1px solid #1e293b', padding: '8px 14px', borderRadius: '12px' }}>
          <Filter size={16} color="#94a3b8"/>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ backgroundColor: 'transparent', color: '#f8fafc', fontSize: '13px', border: 'none', outline: 'none' }}>
            <option value="All" style={{ backgroundColor: '#0f172a' }}>All Status</option>
            <option value="Completed" style={{ backgroundColor: '#0f172a' }}>Completed</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        {loading ? <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading ledger...</div> : transactions.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No transactions found.</div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '16px' }}>ID</th>
                  <th style={{ padding: '16px' }}>Type</th>
                  <th style={{ padding: '16px' }}>Sender</th>
                  <th style={{ padding: '16px' }}>Recipient</th>
                  <th style={{ padding: '16px' }}>Amount</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#94a3b8' }}>#{tx.id}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#f8fafc' }}>{tx.type}</td>
                    <td style={{ padding: '16px', color: '#cbd5e1' }}>@{tx.sender}</td>
                    <td style={{ padding: '16px', color: '#cbd5e1' }}>@{tx.recipient}</td>
                    <td style={{ padding: '16px', fontWeight: '900', color: '#34d399' }}>${tx.amount.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{tx.status}</span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '12px' }}>{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', backgroundColor: '#030712', borderTop: '1px solid #1e293b', fontSize: '13px', color: '#94a3b8' }}>
          <div>Page <strong style={{ color: '#f8fafc' }}>{page}</strong> of <strong style={{ color: '#f8fafc' }}>{totalPages}</strong></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} style={{ padding: '8px', backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={18}/></button>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} style={{ padding: '8px', backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', opacity: page === totalPages ? 0.4 : 1 }}><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}