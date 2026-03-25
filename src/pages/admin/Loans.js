// src/pages/admin/Loans.js
import React, { useState, useEffect } from 'react';
import { loansAPI, clientsAPI } from '../../services/api';
import { Plus, Eye, Calendar } from 'lucide-react';
import LoanModal from '../../components/ui/LoanModal';
import LoanDetail from '../../components/ui/LoanDetail';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';
const statusBadge = (s) => {
  const map = { ACTIVE: ['badge-info', 'Active'], COMPLETED: ['badge-success', 'Paid'], OVERDUE: ['badge-danger', 'Overdue'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await loansAPI.getAll();
      setLoans(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2" style={{ alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Loans</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>{loans.length} active and historical records</p>
        </div>
        <div style={{ textAlign: window.innerWidth < 640 ? 'left' : 'right' }}>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> New Loan
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : loans.length === 0 ? (
            <div className="empty-state"><Calendar size={40} /><p>No loans found</p></div>
          ) : (
            <table>
              <thead><tr>
                <th>Client</th><th>Amount</th><th>Interest</th><th>Duration</th><th>Total Repayable</th><th>Start Date</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr></thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{l.clientId?.name || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{fmtMoney(l.amount)}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{l.interestRate}%</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{l.duration} months</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{fmtMoney(l.totalRepayable)}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{fmtDate(l.startDate)}</td>
                    <td>{statusBadge(l.status)}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-icon btn-sm" title="Details"
                          onClick={() => { setSelected(l); setModal('detail'); }}>
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal === 'add' && (
        <LoanModal onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />
      )}
      {modal === 'detail' && selected && (
        <LoanDetail loan={selected} onClose={() => { setModal(null); setSelected(null); }} />
      )}
    </div>
  );
}
