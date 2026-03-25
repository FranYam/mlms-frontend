// src/pages/admin/Repayments.js
import React, { useState, useEffect } from 'react';
import { loansAPI, repaymentsAPI } from '../../services/api';
import { Wallet, ChevronDown, Plus } from 'lucide-react';
import RepaymentModal from '../../components/ui/RepaymentModal';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';

export default function Repayments() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState('');
  const [repayments, setRepayments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const loadLoans = () => {
    loansAPI.getAll().then(r => setLoans(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleSelect = async (loanId) => {
    setSelectedLoan(loanId);
    if (!loanId) {
      setRepayments([]);
      setPending([]);
      return;
    }
    setLoading(true);
    try {
      const [r, p] = await Promise.all([
        repaymentsAPI.getByLoan(loanId),
        repaymentsAPI.getPending(loanId),
      ]);
      setRepayments(r.data.data);
      setPending(p.data.data);
    } catch {}
    setLoading(false);
  };

  const loan = loans.find(l => l._id === selectedLoan);
  const totalPaid = repayments.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2" style={{ alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Repayments</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>Monitor and record installments</p>
        </div>
        <div style={{ textAlign: window.innerWidth < 640 ? 'left' : 'right' }}>
          <button className="btn btn-primary" onClick={() => setShowPayModal(true)}>
            <Plus size={16} /> New Payment
          </button>
        </div>
      </div>

      {/* Loan selector */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
          Select a loan to view history
        </label>
        <select className="form-control" style={{ maxWidth: 460 }} value={selectedLoan} onChange={e => handleSelect(e.target.value)}>
          <option value="">— Choose a loan from the list —</option>
          {loans.map(l => (
            <option key={l._id} value={l._id}>
              {l.clientId?.name} • {fmtMoney(l.amount)} • {l.status}
            </option>
          ))}
        </select>
      </div>

      {selectedLoan && loan && !loading && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-4" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Payable', value: fmtMoney(loan.totalRepayable) },
              { label: 'Amount Paid', value: fmtMoney(totalPaid), success: true },
              { label: 'Balance Due', value: fmtMoney(Math.max(0, (loan.totalRepayable || 0) - totalPaid)), danger: (loan.totalRepayable - totalPaid) > 0 },
              { label: 'Installments', value: repayments.length },
            ].map(({ label, value, success, danger }) => (
              <div key={label} className="stat-card" style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: success ? 'var(--success)' : danger ? 'var(--danger)' : 'var(--gray-900)' }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2">
            {/* Pending */}
            <div className="card">
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Upcoming Installments ({pending.length})</h3>
              </div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {pending.length === 0 ? (
                  <div className="empty-state"><Wallet size={40} /><p>All installments are completed</p></div>
                ) : (
                  <table>
                    <thead><tr><th>Period</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {pending.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 600 }}>Month {p.monthNumber}</td>
                          <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{fmtMoney(p.amountDue)}</td>
                          <td style={{ fontSize: 12, color: p.status === 'OVERDUE' ? 'var(--danger)' : 'var(--gray-500)' }}>{fmtDate(p.dueDate)}</td>
                          <td>
                            <span className={`badge ${p.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`} style={{ borderRadius: 4 }}>
                              {p.status === 'OVERDUE' ? 'Overdue' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* History */}
            <div className="card">
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Payment History ({repayments.length})</h3>
              </div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {repayments.length === 0 ? (
                  <div className="empty-state"><Wallet size={40} /><p>No payments recorded yet</p></div>
                ) : (
                  <table>
                    <thead><tr><th>Amount</th><th>Date</th><th>Reference/Note</th></tr></thead>
                    <tbody>
                      {repayments.map(r => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 700, color: 'var(--success)' }}>{fmtMoney(r.amount)}</td>
                          <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{fmtDate(r.paidAt)}</td>
                          <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{r.note || 'Regular payment'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedLoan && (
        <div className="card" style={{ padding: 64, textAlign: 'center', background: 'var(--gray-50)', borderStyle: 'dashed' }}>
          <Wallet size={48} style={{ opacity: 0.2, marginBottom: 16, color: 'var(--primary)' }} />
          <p style={{ color: 'var(--gray-400)', fontWeight: 500 }}>Select a client loan to manage its repayment schedule and history</p>
        </div>
      )}

      {showPayModal && (
        <RepaymentModal 
          onClose={() => setShowPayModal(false)} 
          onSave={() => {
            setShowPayModal(false);
            if (selectedLoan) handleSelect(selectedLoan);
            loadLoans();
          }}
        />
      )}
    </div>
  );
}
