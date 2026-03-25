// src/components/layout/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, CreditCard,
  Wallet, BarChart3, LogOut, Building2
} from 'lucide-react';

const navByRole = {
  ADMIN: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: UserCheck, label: 'Clients' },
    { to: '/loans', icon: CreditCard, label: 'Loans' },
    { to: '/repayments', icon: Wallet, label: 'Repayments' },
    { to: '/users', icon: Users, label: 'Users' },
  ],
  LOAN_OFFICER: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: UserCheck, label: 'Clients' },
    { to: '/loans', icon: CreditCard, label: 'Loans' },
    { to: '/repayments', icon: Wallet, label: 'Repayments' },
  ],
  CLIENT: [
    { to: '/my-loan', icon: CreditCard, label: 'My Loan' },
    { to: '/my-schedule', icon: BarChart3, label: 'Schedule' },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navByRole[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = { ADMIN: 'Administrator', LOAN_OFFICER: 'Loan Officer', CLIENT: 'Client' };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : ''}`}
      style={{
        width: 'var(--sidebar-w)', minHeight: '100vh',
        background: 'var(--primary)', display: 'flex',
        flexDirection: 'column', position: 'fixed', left: 0, top: 0,
        zIndex: 1100,
      }}
    >
      {/* Logo - Desktop Only */}
      <div className="desktop-only" style={{ padding: '32px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: '#fff',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Building2 size={18} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '1px' }}>MLMS</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Microfinance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '24px 16px' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', borderRadius: 8, marginBottom: 4,
              textDecoration: 'none', fontSize: 13, fontWeight: 500,
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500 }}>{roleLabel[user?.role]}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}
