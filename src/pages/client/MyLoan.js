// src/pages/client/MyLoan.js
import React, { useState, useEffect } from 'react';
import { loansAPI, repaymentsAPI } from '../../services/api';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const fmtMoney = (n) => new Intl.NumberFormat('en-US').format(n || 0) + ' FCFA';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statusBadge = (s) => {
  const map = { ACTIVE: ['badge-info', 'Active'], COMPLETED: ['badge-success', 'Paid'], OVERDUE: ['badge-danger', 'Overdue'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function MyLoan() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loansAPI.getMyLoan().then(r => { setLoans(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

  if (!loans.length) return (
    <div className="fade-in" style={{ textAlign: 'center', marginTop: 80 }}>
      <CreditCard size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
      <h2 style={{ color: 'var(--gray-500)' }}>No loans found</h2>
      <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>You don't have any loans yet.</p>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>Loan Portfolio Overview</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>Comprehensive summary of your active and past loan agreements.</p>
      </div>

      {loans.map((loan) => {
        const totalPaid = (loan.repayments || []).reduce((s, r) => s + r.amount, 0);
        const remaining = Math.max(0, loan.totalRepayable - totalPaid);
        const progress = Math.min(100, Math.round((totalPaid / (loan.totalRepayable || 1)) * 100));

        return (
          <div key={loan._id} className="card" style={{ marginBottom: 28, padding: '32px 36px', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '1px', marginBottom: 8 }}>Principal Balance</div>
                <div style={{ fontSize: 36, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>
                  {fmtMoney(loan.amount)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>Contract initiated on {fmtDate(loan.startDate)}</div>
              </div>
              <div style={{ transform: 'scale(1.1)', transformOrigin: 'top right' }}>
                {statusBadge(loan.status)}
              </div>
            </div>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-3" style={{ gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Interest Rate', value: `${loan.interestRate}% APR` },
                { label: 'Service Term', value: `${loan.duration} Months` },
                { label: 'Total Interest', value: fmtMoney(loan.interest) },
                { label: 'Total Obligation', value: fmtMoney(loan.totalRepayable) },
                { label: 'Amount Settled', value: fmtMoney(totalPaid), success: true },
                { label: 'Outstanding', value: fmtMoney(remaining), danger: remaining > 0 },
              ].map(({ label, value, success, danger }) => (
                <div key={label} className="stat-card" style={{ background: 'var(--gray-50)', padding: '16px 20px', border: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: success ? 'var(--success)' : danger ? 'var(--danger)' : 'var(--gray-800)' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Elegant Progress Visualization */}
            <div style={{ padding: '24px 28px', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>Repayment Fulfillment Progress</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>{progress}% Complete</span>
              </div>
              <div style={{ background: 'var(--gray-200)', borderRadius: 12, height: 12, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{
                  height: '100%', borderRadius: 12,
                  background: loan.status === 'COMPLETED' ? 'var(--success)' : loan.status === 'OVERDUE' ? 'var(--danger)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
                  width: `${progress}%`, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gray-500)', fontWeight: 500 }}>
                <span>Initial Balance: {fmtMoney(loan.amount)}</span>
                <span>Target Fulfillment: {fmtMoney(loan.totalRepayable)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
