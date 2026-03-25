// src/pages/admin/Users.js
import React, { useState, useEffect } from 'react';
import { usersAPI, clientsAPI } from '../../services/api';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Users as UsersIcon, Eye, Mail, Shield, Smartphone } from 'lucide-react';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';
const roleBadge = (r) => {
  const map = { ADMIN: ['badge-danger', 'Admin'], LOAN_OFFICER: ['badge-info', 'Agent'], CLIENT: ['badge-success', 'Client'] };
  const [cls, label] = map[r] || ['badge-gray', r];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'form' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'LOAN_OFFICER', clientId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [rUsers, rClients] = await Promise.all([
        usersAPI.getAll(),
        clientsAPI.getAll()
      ]);
      setUsers(rUsers.data.data);
      setClients(rClients.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: '', email: '', password: '', role: 'LOAN_OFFICER', clientId: '' }); setSelected(null); setModal('form'); setError(''); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: '', role: u.role, clientId: u.clientId || '' }); setSelected(u); setModal('form'); setError(''); };
  const openView = (u) => { setSelected(u); setModal('view'); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const data = { ...form };
      if (selected && !data.password) delete data.password;
      // Sanitisation : conversion de l'identifiant client vide en null
      if (data.clientId === '') data.clientId = null;
      
      if (selected) await usersAPI.update(selected._id, data);
      else await usersAPI.create(data);
      setModal(null); load();
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleToggle = async (u) => {
    try { await usersAPI.updateStatus(u._id, u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'); load(); } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await usersAPI.remove(id); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2" style={{ alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>User Management</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>Manage administrative and client access</p>
        </div>
        <div style={{ textAlign: window.innerWidth < 640 ? 'left' : 'right' }}>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> New User</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? <div className="page-loader"><div className="spinner" /></div> : users.length === 0 ? (
            <div className="empty-state"><UsersIcon size={40} /><p>No users found</p></div>
          ) : (
            <table>
              <thead><tr><th>Full Name</th><th>Email Address</th><th>System Role</th><th>Status</th><th>Joined Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{u.name}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: 13 }}>{u.email}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'}`} style={{ borderRadius: 4 }}>
                        {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{fmtDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-icon btn-sm" title="View" onClick={() => openView(u)}><Eye size={14} /></button>
                        <button className="btn btn-outline btn-icon btn-sm" title="Edit" onClick={() => openEdit(u)}><Edit2 size={14} /></button>
                        <button className="btn btn-outline btn-icon btn-sm" onClick={() => handleToggle(u)} title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                          {u.status === 'ACTIVE' ? <ToggleRight size={16} color="var(--success)" /> : <ToggleLeft size={16} color="var(--gray-400)" />}
                        </button>
                        <button className="btn btn-outline btn-icon btn-sm" onClick={() => handleDelete(u._id)} style={{ color: 'var(--danger)', borderColor: 'rgba(220,38,38,0.1)' }}>
                          <Trash2 size={14} />
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

      {modal === 'form' && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal fade-in" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selected ? 'Modify' : 'Provision'} Identity Account</h3>
              <button onClick={() => setModal(null)} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ padding: '24px 28px' }}>
                {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}
                
                <div className="form-group">
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Principal Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. John Doe" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Authoritative Email *</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="e.g. j.doe@institution.com" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{selected ? 'Reset Access Token (Optional)' : 'Security Credential *'}</label>
                  <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!selected} placeholder="••••••••" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Institutional Role *</label>
                  <select className="form-control" value={form.role} onChange={e => {
                    const role = e.target.value;
                    setForm({ ...form, role, clientId: role !== 'CLIENT' ? '' : form.clientId });
                  }}>
                    <option value="ADMIN">System Administrator</option>
                    <option value="LOAN_OFFICER">Senior Loan Officer</option>
                    <option value="CLIENT">Borrower Account</option>
                  </select>
                </div>

                {form.role === 'CLIENT' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>Linked Client Profile *</label>
                    <select className="form-control" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} required>
                      <option value="">— Link with existing profile —</option>
                      {clients.map(c => (
                        <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setModal(null)} className="btn btn-outline" style={{ minWidth: 100 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: 160 }}>
                  {saving ? 'Processing...' : (selected ? 'Update Credentials' : 'Create Identity')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'view' && selected && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal fade-in" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Identity Specification</h3>
              <button onClick={() => setModal(null)} className="btn btn-icon btn-outline" style={{ fontSize: 14 }}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '24px 28px' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ 
                  width: 72, height: 72, borderRadius: 16, 
                  background: 'var(--primary-subtle)', color: 'var(--primary)', 
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 28, fontWeight: 800, marginBottom: 16,
                  border: '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  {selected.name?.slice(0, 1).toUpperCase()}
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: 'var(--gray-900)' }}>{selected.name}</h4>
                <div style={{ transform: 'scale(1.1)', display: 'inline-block' }}>{roleBadge(selected.role)}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Mail size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px', marginBottom: 2 }}>Registered Contact</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-700)', fontWeight: 600 }}>{selected.email}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Shield size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px', marginBottom: 2 }}>Authority Status</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 600 }}>
                      Operational: <span style={{ color: selected.status === 'ACTIVE' ? 'var(--success)' : 'var(--gray-400)', textTransform: 'uppercase' }}>{selected.status}</span>
                    </div>
                  </div>
                </div>

                {selected.clientId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      <Smartphone size={16} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.5px', marginBottom: 2 }}>Linked Portfolio ID</div>
                      <code style={{ fontSize: 12, background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>{selected.clientId}</code>
                    </div>
                  </div>
                )}
                
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8, borderTop: '1px solid var(--gray-100)', paddingTop: 16, fontWeight: 600, textAlign: 'center' }}>
                  IDENTITY PROVISIONED ON {fmtDate(selected.createdAt).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setModal(null)} className="btn btn-outline" style={{ width: '100%', fontWeight: 700 }}>Close Identity File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
