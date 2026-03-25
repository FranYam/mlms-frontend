// src/components/ui/RepaymentModal.js
import React, { useState, useEffect } from 'react';
import { repaymentsAPI, loansAPI } from '../../services/api';
import { X, CheckCircle } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';

export default function RepaymentModal({ loanId, scheduleId, onClose, onSave }) {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(loanId || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loanId) {
      setLoading(true);
      loansAPI.getAll().then(r => {
        setLoans(r.data.data.filter(l => l.status !== 'COMPLETED'));
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [loanId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoanId || !amount) return;
    setSubmitting(true);
    setError('');
    try {
      await repaymentsAPI.record({
        loanId: selectedLoanId,
        scheduleId: scheduleId || undefined,
        amount: parseFloat(amount),
        note,
      });
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error during saving');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Record Payment Transaction</h3>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px 28px' }}>
            {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}
            
            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Account / Loan Reference *</label>
              <select 
                className="form-control" 
                value={selectedLoanId} 
                onChange={e => setSelectedLoanId(e.target.value)}
                required
                disabled={!!loanId || loading}
              >
                <option value="">— Search and select a loan —</option>
                {loans.map(l => (
                  <option key={l._id} value={l._id}>
                    {l.clientId?.name} • {fmtMoney(l.amount)} • {l.status}
                  </option>
                ))}
              </select>
              {loading && <p style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 6, fontWeight: 500 }}>Retrieving active loan accounts...</p>}
            </div>

            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Payment Amount (FCFA) *</label>
              <input 
                className="form-control" 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="e.g. 25,000"
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Internal Reference / Note</label>
              <textarea 
                className="form-control" 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                placeholder="Optional payment description or reference number..."
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ minWidth: 100 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting || (loading && !loanId)} style={{ minWidth: 160 }}>
              {submitting ? 'Processing...' : 'Verify & Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
