// src/pages/admin/Clients.js
import React, { useState, useEffect } from 'react';
import { clientsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Edit2, Trash2, Eye, UserCheck } from 'lucide-react';
import ClientModal from '../../components/ui/ClientModal';
import ClientDetail from '../../components/ui/ClientDetail';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US') : '—';

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'detail'
  const [selected, setSelected] = useState(null);

  const load = async (s = '') => {
    setLoading(true);
    try {
      const res = await clientsAPI.getAll(s);
      setClients(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const t = setTimeout(() => load(e.target.value), 400);
    return () => clearTimeout(t);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await clientsAPI.remove(id);
      load(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2" style={{ alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Clients</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>{clients.length} client(s) registered</p>
        </div>
        <div style={{ textAlign: window.innerWidth < 640 ? 'left' : 'right' }}>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> New Client
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--gray-200)' }}>
        <Search size={16} color="var(--gray-400)" />
        <input
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent', color: 'var(--gray-800)' }}
          placeholder="Search by name or phone..."
          value={search} onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : clients.length === 0 ? (
            <div className="empty-state"><UserCheck size={40} /><p>No clients found</p></div>
          ) : (
            <table>
              <thead><tr>
                <th>Name</th><th>Phone</th><th>Address</th><th>Registration Date</th><th>Loans</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr></thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'var(--primary-subtle)', color: 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                          {c.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td>{c.phone}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: 12 }}>{c.address}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{fmtDate(c.registeredAt)}</td>
                    <td>
                      <span className="badge badge-info" style={{ borderRadius: 4 }}>{c.loans?.length || 0} Loans</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-icon btn-sm" title="View" onClick={() => { setSelected(c); setModal('detail'); }}>
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-outline btn-icon btn-sm" title="Edit" onClick={() => { setSelected(c); setModal('edit'); }}>
                          <Edit2 size={14} />
                        </button>
                        {user.role === 'ADMIN' && (
                          <button className="btn btn-outline btn-icon btn-sm" title="Delete" onClick={() => handleDelete(c._id)}
                            style={{ color: 'var(--danger)', borderColor: 'rgba(220,38,38,0.1)' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <ClientModal
          client={modal === 'edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={() => { setModal(null); setSelected(null); load(search); }}
        />
      )}

      {modal === 'detail' && selected && (
        <ClientDetail
          clientId={selected._id}
          onClose={() => { setModal(null); setSelected(null); }}
        />
      )}
    </div>
  );
}
