// src/pages/client/MySchedule.js
import React, { useState, useEffect } from 'react';
import { loansAPI } from '../../services/api';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

export default function MySchedule() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loansAPI.getMyLoan()
      .then(r => { setLoans(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (id) => {
    setSelectedLoan(id);
    if (!id) return;
    try {
      const r = await loansAPI.getSchedule(id);
      setSchedule(r.data.data);
    } catch {}
  };

  useEffect(() => {
    if (loans.length === 1 && !selectedLoan) {
      handleSelect(loans[0]._id);
    }
  }, [loans, selectedLoan]);

  const paid = schedule.filter(s => s.status === 'PAID').length;
  const overdue = schedule.filter(s => s.status === 'OVERDUE').length;
  const pending = schedule.filter(s => s.status === 'PENDING').length;

  if (loading) return <div className="page-loader"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>Amortization Schedule</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>Detailed breakdown of your scheduled repayment installments and their current status.</p>
      </div>

      {loans.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: 'center', border: '1px dashed var(--gray-200)' }}>
          <Calendar size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
          <p style={{ color: 'var(--gray-400)', fontWeight: 500 }}>No repayment schedules found for your account.</p>
        </div>
      ) : (
        <>
          {loans.length > 1 && (
            <div className="card" style={{ padding: '16px 20px', marginBottom: 24, border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px' }}>Select Account:</label>
                <select className="form-control" style={{ maxWidth: 380, height: 38, fontSize: 13, fontWeight: 600 }} value={selectedLoan} onChange={e => handleSelect(e.target.value)}>
                  <option value="">Choose a loan to view schedule...</option>
                  {loans.map(l => <option key={l._id} value={l._id}>{fmtMoney(l.amount)} — {l.status}</option>)}
                </select>
              </div>
            </div>
          )}

          {schedule.length > 0 && (
            <>
              {/* Stats Summary Grid */}
              <div className="grid grid-cols-3" style={{ gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Settled', count: paid, icon: CheckCircle, color: 'var(--success)', bg: 'rgba(22, 163, 74, 0.05)' },
                  { label: 'Upcoming', count: pending, icon: Clock, color: 'var(--warning)', bg: 'rgba(217, 119, 6, 0.05)' },
                  { label: 'Delinquent', count: overdue, icon: AlertCircle, color: 'var(--danger)', bg: 'rgba(220, 38, 38, 0.05)' },
                ].map(({ label, count, icon: Icon, color, bg }) => (
                  <div key={label} className="stat-card" style={{ padding: '20px 24px', border: '1px solid var(--gray-50)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ background: bg, width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px', marginTop: 4 }}>{label}</div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: color, lineHeight: 1 }}>{count}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4, fontWeight: 500 }}>Installments Recorded</div>
                  </div>
                ))}
              </div>

              {/* Schedule Table Container */}
              <div className="card" style={{ border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)' }}>Fulfillment Log <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--gray-100)', color: 'var(--gray-500)', padding: '2px 8px', borderRadius: 4 }}>{schedule.length} Total Periods</span></h3>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)' }}>Last synced: Just Now</div>
                </div>
                <div className="table-wrap">
                  <table style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 24, fontSize: 10, textTransform: 'uppercase', color: 'var(--gray-400)', fontWeight: 700 }}>Billing Period</th>
                        <th style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--gray-400)', fontWeight: 700 }}>Due Amount</th>
                        <th style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--gray-400)', fontWeight: 700 }}>Deadline</th>
                        <th style={{ paddingRight: 24, fontSize: 10, textTransform: 'uppercase', color: 'var(--gray-400)', fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map(s => (
                        <tr key={s._id} style={{ 
                          background: s.status === 'OVERDUE' ? 'rgba(220, 38, 38, 0.02)' : s.status === 'PAID' ? 'rgba(22, 163, 74, 0.02)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}>
                          <td style={{ paddingLeft: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: 8,
                                background: s.status === 'PAID' ? 'var(--success-light)' : s.status === 'OVERDUE' ? 'var(--danger-light)' : 'var(--gray-100)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 700,
                                color: s.status === 'PAID' ? 'var(--success)' : s.status === 'OVERDUE' ? 'var(--danger)' : 'var(--gray-500)',
                              }}>{s.monthNumber}</div>
                              <span style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: 13 }}>Cycle {s.monthNumber}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 14 }}>{fmtMoney(s.amountDue)}</td>
                          <td style={{ color: s.status === 'OVERDUE' ? 'var(--danger)' : 'var(--gray-500)', fontSize: 12, fontWeight: 500 }}>{fmtDate(s.dueDate)}</td>
                          <td style={{ paddingRight: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {s.status === 'PAID' && <CheckCircle size={14} color="var(--success)" />}
                              {s.status === 'OVERDUE' && <AlertCircle size={14} color="var(--danger)" />}
                              {s.status === 'PENDING' && <Clock size={14} color="var(--warning)" />}
                              <span style={{ 
                                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                                color: s.status === 'PAID' ? 'var(--success)' : s.status === 'OVERDUE' ? 'var(--danger)' : 'var(--warning)'
                              }}>
                                {s.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
