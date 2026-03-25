// src/components/ui/ClientModal.js
import React, { useState } from 'react';
import { clientsAPI } from '../../services/api';
import { X } from 'lucide-react';

export default function ClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    address: client?.address || '',
    email: client?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (client) {
        await clientsAPI.update(client._id, form);
      } else {
        await clientsAPI.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{client ? 'Modify Client Profile' : 'Register New Client'}</h3>
          <button onClick={onClose} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px 28px' }}>
            {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}
            
            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Legal Full Name *</label>
              <input className="form-control" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Johnathan Doe" />
            </div>

            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Contact Phone Number *</label>
              <input className="form-control" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+226 00 00 00 00" />
            </div>

            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Residential Address *</label>
              <input className="form-control" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="Sector, City, Country" />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Email Address (Optional)</label>
              <input className="form-control" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@example.com" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ minWidth: 100 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
              {loading ? 'Processing...' : (client ? 'Save Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
