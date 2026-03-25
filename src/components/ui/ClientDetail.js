// src/components/ui/ClientDetail.js
import React, { useState, useEffect } from 'react';
import { clientsAPI } from '../../services/api';
import { X, Phone, MapPin, Mail, CreditCard } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';
const statusBadge = (s) => {
  const map = { ACTIVE: ['badge-info', 'Active'], COMPLETED: ['badge-success', 'Paid'], OVERDUE: ['badge-danger', 'Overdue'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function ClientDetail({ clientId, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsAPI.getById(clientId).then(r => {
      setClient(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [clientId]);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Client Profile Information</h3>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: '24px 28px' }}>
          {loading ? <div className="page-loader"><div className="spinner" /></div> : client ? (
            <>
              {/* Profile Overview Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: '20px 24px', background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: 'var(--primary-subtle)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, border: '1px solid rgba(0,0,0,0.05)'
                }}>{client.name?.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--gray-900)', marginBottom: 2 }}>{client.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>Customer since {fmtDate(client.registeredAt)}</div>
                </div>
              </div>

              {/* Contact Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                {[
                  { icon: Phone, label: client.phone, title: 'Primary Phone' },
                  { icon: MapPin, label: client.address, title: 'Office Address' },
                  ...(client.email ? [{ icon: Mail, label: client.email, title: 'Email Address' }] : []),
                ].map(({ icon: Icon, label, title }) => (
                  <div key={label} style={{ display: 'flex', gap: 12, background: 'white', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--gray-50)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px' }}>{title}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 500 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Associated Loan Accounts */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, borderBottom: '1px solid var(--gray-100)', paddingBottom: 10 }}>
                  <CreditCard size={16} color="var(--primary)" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)' }}>Loan Portfolio <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4 }}>{client.loans?.length || 0} Accounts</span></h4>
                </div>
                {!client.loans?.length ? (
                  <div className="empty-state" style={{ padding: 32 }}>
                    <p style={{ color: 'var(--gray-400)', fontWeight: 500 }}>No active or past loans associated with this profile</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {client.loans.map((loan) => (
                      <div key={loan._id} className="stat-card" style={{ padding: '16px 20px', border: '1px solid var(--gray-100)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-900)' }}>{fmtMoney(loan.amount)}</span>
                          {statusBadge(loan.status)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 11, color: 'var(--gray-500)', borderTop: '1px solid var(--gray-50)', paddingTop: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 9, color: 'var(--gray-400)', marginBottom: 2 }}>Rate</div>
                            <div style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{loan.interestRate}% APR</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 9, color: 'var(--gray-400)', marginBottom: 2 }}>Term</div>
                            <div style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{loan.duration} Mo.</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 9, color: 'var(--gray-400)', marginBottom: 2 }}>Interest</div>
                            <div style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{fmtMoney(loan.interest)}</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 9, color: 'var(--gray-400)', marginBottom: 2 }}>Fulfillment</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700 }}>{fmtMoney(loan.totalRepayable)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : <p>Client information could not be retrieved.</p>}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline" style={{ minWidth: 120 }}>Close Profile</button>
        </div>
      </div>
    </div>
  );
}
