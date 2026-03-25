// src/components/ui/LoanDetail.js
import React, { useState, useEffect } from 'react';
import { loansAPI, repaymentsAPI } from '../../services/api';
import { X, CheckCircle, Clock, AlertCircle, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RepaymentModal from './RepaymentModal';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';

const scheduleStatusIcon = (s) => {
  if (s === 'PAID') return <CheckCircle size={13} color="var(--success)" />;
  if (s === 'OVERDUE') return <AlertCircle size={13} color="var(--danger)" />;
  return <Clock size={13} color="var(--gray-400)" />;
};

export default function LoanDetail({ loan, onClose }) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [tab, setTab] = useState('schedule');
  const [payModal, setPayModal] = useState(null); // stores the schedule item
  const [status, setStatus] = useState(loan.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const [s, r] = await Promise.all([
        loansAPI.getSchedule(loan._id),
        repaymentsAPI.getByLoan(loan._id),
      ]);
      setSchedule(s.data.data);
      setRepayments(r.data.data);
    } catch {}
  };

  useEffect(() => { load(); }, [loan._id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    setUpdatingStatus(true);
    try {
      await loansAPI.updateStatus(loan._id, newStatus);
      setStatus(newStatus);
      setMsg('Status updated successfully');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error during update');
    }
    setUpdatingStatus(false);
  };

  const totalPaid = repayments.reduce((s, r) => s + r.amount, 0);
  const remaining = (loan.totalRepayable || 0) - totalPaid;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Loan Reference Detail</h3>
            {user.role === 'ADMIN' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <Edit size={12} color="var(--gray-400)" />
                <select 
                  style={{ border: 'none', background: 'transparent', fontSize: 11, fontWeight: 700, color: 'var(--primary)', outline: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
                  value={status} 
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="ACTIVE">System Active</option>
                  <option value="OVERDUE">Mark Overdue</option>
                  <option value="COMPLETED">Mark Paid</option>
                </select>
              </div>
            )}
          </div>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: '24px 28px' }}>
          {msg && <div className={`alert ${msg.toLowerCase().includes('successfully') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 20 }}>{msg}</div>}

          {/* Detailed Info Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Principal', value: fmtMoney(loan.amount) },
              { label: 'Interest', value: fmtMoney(loan.interest) },
              { label: 'Total Payable', value: fmtMoney(loan.totalRepayable) },
              { label: 'Outstanding', value: fmtMoney(Math.max(0, remaining)), danger: remaining > 0 },
            ].map(({ label, value, danger }) => (
              <div key={label} className="stat-card" style={{ padding: '14px 16px', background: danger ? 'rgba(220, 38, 38, 0.02)' : 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: danger ? 'var(--danger)' : 'var(--gray-900)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Repayment Progress Visualization */}
          <div style={{ marginBottom: 32, padding: '16px 20px', background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)' }}>Repayment Fulfillment Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{Math.round((totalPaid / (loan.totalRepayable || 1)) * 100)}% Complete</span>
            </div>
            <div style={{ background: 'var(--gray-200)', borderRadius: 10, height: 10, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{
                height: '100%', borderRadius: 10,
                background: status === 'COMPLETED' ? 'var(--success)' : status === 'OVERDUE' ? 'var(--danger)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
                width: `${Math.min(100, Math.round((totalPaid / (loan.totalRepayable || 1)) * 100))}%`,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <div style={{ marginTop: 8, textAlign: 'right', fontSize: 11, color: 'var(--gray-500)', fontWeight: 500 }}>
              {fmtMoney(totalPaid)} paid of {fmtMoney(loan.totalRepayable)}
            </div>
          </div>

          {/* Interaction Tabs */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 20, borderBottom: '1px solid var(--gray-200)' }}>
            {[['schedule', 'Repayment Schedule'], ['repayments', 'Payment Records']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: '12px 4px', border: 'none', background: 'transparent',
                fontSize: 13, fontWeight: tab === key ? 700 : 500,
                color: tab === key ? 'var(--primary)' : 'var(--gray-400)',
                borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1, transition: 'all 0.2s ease'
              }}>{label} <span style={{ marginLeft: 6, fontSize: 11, background: tab === key ? 'var(--primary-subtle)' : 'var(--gray-100)', color: tab === key ? 'var(--primary)' : 'var(--gray-500)', padding: '2px 6px', borderRadius: 4 }}>{key === 'schedule' ? schedule.length : repayments.length}</span></button>
            ))}
          </div>

          {tab === 'schedule' && (
            <div style={{ maxHeight: 350, overflowY: 'auto' }} className="table-wrap">
              <table>
                <thead><tr><th>Billing Period</th><th>Amount Due</th><th>Deadline</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  {schedule.map((s) => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Month {s.monthNumber}</td>
                      <td style={{ fontWeight: 600 }}>{fmtMoney(s.amountDue)}</td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{fmtDate(s.dueDate)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {scheduleStatusIcon(s.status)}
                          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: s.status === 'PAID' ? 'var(--success)' : s.status === 'OVERDUE' ? 'var(--danger)' : 'var(--gray-400)' }}>{s.status}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {s.status !== 'PAID' && status !== 'COMPLETED' && (
                            <button className="btn btn-accent btn-sm" onClick={() => setPayModal(s)} style={{ fontSize: 11, padding: '4px 12px' }}>
                              Record Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'repayments' && (
            <div style={{ maxHeight: 350, overflowY: 'auto' }} className="table-wrap">
              {repayments.length === 0 ? (
                <div className="empty-state" style={{ padding: 48 }}>
                  <Clock size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                  <p style={{ color: 'var(--gray-400)', fontWeight: 500 }}>No transaction history found for this loan</p>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Processed Amount</th><th>Posting Date</th><th>Reference Note</th></tr></thead>
                  <tbody>
                    {repayments.map((r) => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>{fmtMoney(r.amount)}</td>
                        <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{fmtDate(r.paidAt)}</td>
                        <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{r.note || 'Manual settlement'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {payModal && (
          <RepaymentModal 
            loanId={loan._id} 
            scheduleId={payModal._id} 
            onClose={() => setPayModal(null)} 
            onSave={() => {
              setPayModal(null);
              setMsg('Payment recorded successfully');
              load();
            }}
          />
        )}

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline" style={{ minWidth: 120 }}>Close View</button>
        </div>
      </div>
    </div>
  );
}
