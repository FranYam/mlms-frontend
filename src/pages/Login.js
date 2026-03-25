// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'CLIENT') navigate('/my-loan');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, var(--primary) 0%, #2D1B6E 100%)',
    }}>
      {/* Executive Branding Panel */}
      <div style={{
        flex: 1.2, alignItems: 'center', justifyContent: 'center',
        padding: 60, display: window.innerWidth < 1024 ? 'none' : 'flex',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'var(--accent)', opacity: 0.03, borderRadius: '50%', filter: 'blur(100px)' }} />
        
        <div style={{ color: '#fff', maxWidth: 420, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent), var(--primary))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
              <Building2 size={28} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>MLMS <span style={{ color: 'var(--accent)', fontSize: 14, verticalAlign: 'super', fontWeight: 600 }}>PRO</span></span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            Next-Generation<br />Loan Infrastructure
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, lineHeight: 1.6, marginBottom: 48, fontWeight: 400 }}>
            Empowering microfinance institutions with precision analytics and streamlined portfolio management.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { title: 'Global Portfolio Control', desc: 'Real-time monitoring across all accounts' },
              { title: 'Automated Compliance', desc: 'Precision interest and penalty calculations' },
              { title: 'Executive Reporting', desc: 'Comprehensive data visualization for decisions' }
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 8, boxShadow: '0 0 10px var(--accent)' }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Authentication Panel */}
      <div style={{
        flex: 1, maxWidth: window.innerWidth < 1024 ? '100%' : 540,
        background: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 60,
        boxShadow: '-20px 0 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8, letterSpacing: '-0.5px' }}>
              System Access
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, fontWeight: 500 }}>Enter your institutional credentials to proceed</p>
          </div>

          {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: 8 }}>Official Email</label>
              <input className="form-control" type="email" placeholder="e.g. administrator@mlms.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required 
                style={{ height: 48, fontSize: 15 }} />
            </div>
            <div className="form-group" style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: 8 }}>Secure Password</label>
              <input className="form-control" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required 
                style={{ height: 48, fontSize: 15 }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', height: 50, fontSize: 15, fontWeight: 700, borderRadius: 10, boxShadow: '0 10px 15px -3px rgba(108, 76, 241, 0.2)' }}>
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 10 }} /> Authenticating...</> : 'Authorize Entry'}
            </button>
          </form>

          <div style={{ marginTop: 48, padding: '24px', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Authorized Demo Access</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { role: 'Administrator', email: 'admin@mlms.com' },
                { role: 'Loan Officer', email: 'officer@mlms.com' },
                { role: 'Client Portal', email: 'ali.client@mlms.com' },
              ].map(({ role, email }) => (
                <div key={email} onClick={() => setForm({ email, password: 'secret123' })}
                  className="test-account"
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', cursor: 'pointer', borderRadius: 8, background: '#fff', border: '1px solid var(--gray-200)', transition: 'all 0.2s ease' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{role}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>{email}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>Global Password: <code style={{ color: 'var(--primary)', fontWeight: 700 }}>secret123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
