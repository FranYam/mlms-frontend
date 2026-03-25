// src/pages/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ShieldCheck, Zap, BarChart3, 
  ArrowRight, CheckCircle2, Globe, Users
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Navigation Header */}
      <header style={{ 
        padding: '24px 40px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', borderBottom: '1px solid var(--gray-100)',
        position: 'sticky', top: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 40, height: 40, background: 'var(--primary)', 
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <Building2 size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>
            MLMS <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12, verticalAlign: 'super' }}>PRO</span>
          </span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-primary" 
          style={{ borderRadius: 10, padding: '10px 24px' }}
        >
          Enter Portal
        </button>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '100px 40px', background: 'radial-gradient(circle at top right, var(--primary-subtle) 0%, #fff 60%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            background: 'var(--primary-subtle)', color: 'var(--primary)', 
            padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, 
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 32
          }}>
            <Zap size={14} fill="var(--primary)" /> The New Standard in Microfinance
          </div>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', fontSize: 64, fontWeight: 800, 
            lineHeight: 1.1, color: 'var(--gray-900)', marginBottom: 24, letterSpacing: '-2px'
          }}>
            Accelerate your lending <br />
            <span style={{ color: 'var(--primary)' }}>with institutional precision.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
            MLMS Pro empowers modern financial institutions with automated workflows, real-time risk assessment, and a seamless client experience.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary" 
              style={{ padding: '16px 36px', fontSize: 16, borderRadius: 12, boxShadow: '0 20px 25px -5px rgba(108, 76, 241, 0.3)' }}
            >
              Get Started Now <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{ 
          position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', 
          width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--gray-200), transparent)' 
        }} />
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>Built for Institutional Excellence</h2>
          <p style={{ color: 'var(--gray-500)', maxWidth: 500, margin: '0 auto' }}>Everything you need to manage a high-performance loan portfolio in a single, unified interface.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {[
            { 
              title: "Portfolio Analytics", 
              desc: "Gain real-time insights into your active loans, total capital, and repayment trends with boardroom-ready visualizations.",
              icon: BarChart3
            },
            { 
              title: "Automated Compliance", 
              desc: "Automate complex interest calculations and penalty assessments while ensuring 100% regulatory alignment.",
              icon: ShieldCheck
            },
            { 
              title: "Client Portal Pro", 
              desc: "Empower borrowers with a dedicated self-service interface to track their schedules and payment history.",
              icon: Users
            }
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: 40, border: '1px solid var(--gray-100)', textAlign: 'left' }}>
              <div style={{ 
                width: 52, height: 52, background: 'var(--primary-subtle)', color: 'var(--primary)', 
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24
              }}>
                <f.icon size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '80px 40px', background: 'var(--gray-50)', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 40 }}>Institutional Capabilities at Scale</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40, opacity: 0.6 }}>
            {['Multi-Role Access', 'Real-time Calculations', 'Secure Database API', 'Amortization Engine', 'Global Translations'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{ padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ 
          background: 'var(--primary)', borderRadius: 24, padding: '80px 40px', 
          color: '#fff', maxWidth: 1000, margin: '0 auto', boxShadow: '0 30px 60px -15px rgba(108, 76, 241, 0.4)'
        }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: '#fff' }}>Ready to digitize your operations?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40 }}>Join institutions transforming their financial services today.</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn" 
            style={{ background: '#fff', color: 'var(--primary)', padding: '16px 48px', fontSize: 16, fontWeight: 800, borderRadius: 12 }}
          >
            Access Portal
          </button>
        </div>
        <div style={{ marginTop: 64, color: 'var(--gray-400)', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <Globe size={14} /> Global Distribution Readiness
          </div>
          &copy; 2026 Microfinance Loan Management System Pro. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
