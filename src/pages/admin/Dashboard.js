// src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { Users, CreditCard, DollarSign, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusBadge = (s) => {
  const map = { ACTIVE: ['badge-info', 'Active'], COMPLETED: ['badge-success', 'Paid'], OVERDUE: ['badge-danger', 'Overdue'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, o, r] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getOverdue(),
          dashboardAPI.getRecentLoans(),
        ]);
        setStats(s.data.data);
        setOverdue(o.data.data);
        setRecentLoans(r.data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

  const statCards = [
    { label: 'Total Clients', value: stats?.totalClients || 0, icon: Users, color: 'var(--primary-subtle)', iconColor: 'var(--primary)' },
    { label: 'Active Loans', value: stats?.activeLoans || 0, icon: CreditCard, color: 'var(--accent-light)', iconColor: 'var(--accent)' },
    { label: 'Total Amount Loaned', value: fmtMoney(stats?.totalLoanAmount), icon: DollarSign, color: 'var(--success-light)', iconColor: 'var(--success)', big: true },
    { label: 'Overdue Loans', value: stats?.overdueLoans || 0, icon: AlertTriangle, color: 'var(--danger-light)', iconColor: 'var(--danger)' },
    { label: 'Due Today', value: stats?.loansDueToday || 0, icon: Clock, color: 'var(--warning-light)', iconColor: 'var(--warning)' },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>Welcome back! Here is your institution's overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5" style={{ marginBottom: 32 }}>
        {statCards.map(({ label, value, icon: Icon, color, iconColor, big }) => (
          <div key={label} className="stat-card fade-in" style={{ padding: 24 }}>
            <div className="stat-icon" style={{ background: color }}>
              <Icon size={20} color={iconColor} />
            </div>
            <div className="stat-value" style={{ fontSize: big ? 17 : 28, color: 'var(--gray-900)' }}>{value}</div>
            <div className="stat-label" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Overdue loans */}
        <div className="card">
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={15} color="var(--danger)" />
            <h3 style={{ fontSize: 14 }}>Overdue Loans</h3>
            {overdue.length > 0 && <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>{overdue.length}</span>}
          </div>
          <div className="table-wrap">
            {overdue.length === 0 ? (
              <div className="empty-state"><TrendingUp size={32} /><p>No overdue loans</p></div>
            ) : (
              <table>
                <thead><tr>
                  <th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {overdue.map((l) => (
                    <tr key={l.loanId}>
                      <td style={{ fontWeight: 500 }}>{l.clientName}</td>
                      <td>{fmtMoney(l.loanAmount)}</td>
                      <td style={{ color: 'var(--danger)' }}>{fmtDate(l.dueDate)}</td>
                      <td>{statusBadge('OVERDUE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent loans */}
        <div className="card">
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={15} color="var(--primary)" />
            <h3 style={{ fontSize: 14 }}>Recent Loans</h3>
          </div>
          <div className="table-wrap">
            {recentLoans.length === 0 ? (
              <div className="empty-state"><CreditCard size={32} /><p>No loans found</p></div>
            ) : (
              <table>
                <thead><tr>
                  <th>Client</th><th>Amount</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {recentLoans.slice(0, 8).map((l) => (
                    <tr key={l._id}>
                      <td style={{ fontWeight: 500 }}>{l.clientId?.name}</td>
                      <td>{fmtMoney(l.amount)}</td>
                      <td>{statusBadge(l.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
