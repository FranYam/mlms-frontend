// src/components/ui/LoanModal.js
import React, { useState, useEffect } from 'react';
import { loansAPI, clientsAPI } from '../../services/api';
import { X, Calculator } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(Math.round(n || 0)) + ' FCFA';

export default function LoanModal({ onClose, onSave }) {
  const [form, setForm] = useState({ clientId: '', amount: '', interestRate: '', duration: '' });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    clientsAPI.getAll().then(r => setClients(r.data.data)).catch(() => {});
  }, []);

  const amount = parseFloat(form.amount) || 0;
  const rate = parseFloat(form.interestRate) || 0;
  const duration = parseInt(form.duration) || 0;
  const interest = amount * (rate / 100);
  const total = amount + interest;
  const monthly = duration > 0 ? Math.round(total / duration) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loansAPI.create({
        clientId: form.clientId,
        amount: parseFloat(form.amount),
        interestRate: parseFloat(form.interestRate),
        duration: parseInt(form.duration),
      });
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Initiate New Loan Account</h3>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px 28px' }}>
            {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}
            
            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Target Client *</label>
              <select className="form-control" value={form.clientId}
                onChange={e => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">Search and select a client...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Principal Amount (FCFA) *</label>
                <input className="form-control" type="number" min="0" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} required placeholder="e.g. 500,000" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Annual Interest Rate (%) *</label>
                <input className="form-control" type="number" min="0" max="100" step="0.1" value={form.interestRate}
                  onChange={e => setForm({ ...form, interestRate: e.target.value })} required placeholder="e.g. 12.5" />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Loan Duration (Months) *</label>
              <input className="form-control" type="number" min="1" value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })} required placeholder="e.g. 24" />
            </div>

            {/* Premium Calculation Preview */}
            <div style={{ 
              background: amount > 0 && rate > 0 && duration > 0 ? 'var(--primary-subtle)' : 'var(--gray-50)', 
              borderRadius: 12, padding: '20px 24px', marginTop: 8,
              border: '1px solid',
              borderColor: amount > 0 && rate > 0 && duration > 0 ? 'rgba(42, 82, 152, 0.1)' : 'var(--gray-200)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 11, fontWeight: 700, color: amount > 0 && rate > 0 && duration > 0 ? 'var(--primary)' : 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Calculator size={14} /> {amount > 0 && rate > 0 && duration > 0 ? 'Amortization Summary' : 'Enter details for preview'}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Total Interest', value: amount > 0 && rate > 0 ? fmtMoney(interest) : '—' },
                  { label: 'Total Repayable', value: amount > 0 && rate > 0 ? fmtMoney(total) : '—' },
                  { label: 'Monthly Repayment', value: duration > 0 ? fmtMoney(monthly) : '—', primary: true },
                  { label: 'Contract Term', value: duration > 0 ? `${duration} Billing Months` : '—' },
                ].map(({ label, value, primary }) => (
                  <div key={label} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 9, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: primary ? 'var(--primary)' : 'var(--gray-800)' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ minWidth: 100 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
              {loading ? 'Processing...' : 'Authorize Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
