// src/components/layout/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import { Menu, X, Building2 } from 'lucide-react';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="mobile-only flex" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--header-h)',
        background: 'var(--primary)', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', padding: '0 24px', zIndex: 1000,
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 6, display: 'flex' }}>
            <Building2 size={20} color="var(--primary)" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '0.5px' }}>MLMS Pro</span>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', 
            padding: 10, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Overlay for mobile when sidebar is open */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          style={{ 
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', 
            backdropFilter: 'blur(4px)', zIndex: 900 
          }} 
          className="mobile-only"
        />
      )}

      <main className="main-content" style={{
        marginLeft: 'var(--sidebar-w)',
        flex: 1, padding: '28px 32px',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}
