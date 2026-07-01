import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const API = import.meta.env.VITE_API_URL;

const getAdminToken = () => localStorage.getItem('admin_token') || '';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAdminToken()}`,
});

const CATEGORIES = ['SSC', 'Banking', 'UPSC', 'Railway', 'State PCS', 'Police', 'Defence', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyForm = { title: '', description: '', category: 'SSC', difficulty: 'Medium', price: 499, discountPrice: '', isFree: false, isActive: true, isImportantUpdate: false };

export default function TestSeriesAdmin() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadSeries(); }, []);

  const loadSeries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/test-series/admin/all`, { headers: headers() });
      const data = await res.json();
      setSeries(data.data || []);
    } catch { setSeries([]); }
    setLoading(false);
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, discountPrice: s.discountPrice || '', isFree: s.isFree }); setError(''); setShowForm(true); };

  const handleSave = async () => {
    setError('');
    if (!form.title || !form.description) { setError('Title and description are required.'); return; }
    setSaving(true);
    try {
      const body = { ...form, discountPrice: form.discountPrice ? Number(form.discountPrice) : null, price: Number(form.price) };
      const url = editing ? `${API}/test-series/${editing._id}` : `${API}/test-series`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) { setError(data.message); } else { setShowForm(false); loadSeries(); }
    } catch { setError('Save failed.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this test series? All tests and questions inside will also be deleted.')) return;
    await fetch(`${API}/test-series/${id}`, { method: 'DELETE', headers: headers() });
    loadSeries();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Test Series Management</h2>
          <p>Create and manage all test series available to students</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>+ New Test Series</button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Category</th><th>Difficulty</th><th>Price</th><th>Tests</th><th>Students</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {series.map(s => (
                <tr key={s._id}>
                  <td className="font-medium max-w-xs truncate">{s.title}</td>
                  <td><span className="admin-badge admin-badge-blue">{s.category}</span></td>
                  <td><span className={`admin-badge ${s.difficulty === 'Easy' ? 'admin-badge-green' : s.difficulty === 'Hard' ? 'admin-badge-red' : 'admin-badge-yellow'}`}>{s.difficulty}</span></td>
                  <td>{s.isFree ? <span className="admin-badge admin-badge-green">FREE</span> : <span>₹{s.discountPrice ? <><s className="text-gray-400">₹{s.price}</s> ₹{s.discountPrice}</> : s.price}</span>}</td>
                  <td>{s.totalTests || 0}</td>
                  <td>{s.studentsEnrolled || 0}</td>
                  <td><span className={`admin-badge ${s.isActive ? 'admin-badge-green' : 'admin-badge-red'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      <Link to={`/admin/test-series/${s._id}/tests`} className="admin-btn admin-btn-sm admin-btn-secondary">Manage Tests</Link>
                      <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => openEdit(s)}>Edit</button>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {series.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No test series yet. Create your first one!</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Test Series' : 'Create Test Series'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              {error && <div className="admin-error">{error}</div>}
              <div className="admin-form-grid">
                <div className="admin-form-group admin-full-width">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. SSC CGL 2024 Mock Test Series" />
                </div>
                <div className="admin-form-group admin-full-width">
                  <label>Description *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe this test series..." />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Price (₹) <span style={{ color: '#6b7280', fontSize: '12px' }}>Set 0 for free</span></label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value), isFree: Number(e.target.value) === 0 }))} />
                </div>
                <div className="admin-form-group">
                  <label>Discount Price (₹) <span style={{ color: '#6b7280', fontSize: '12px' }}>Optional</span></label>
                  <input type="number" min="0" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="Leave blank if no discount" />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked, price: e.target.checked ? 0 : f.price }))} />
                    Mark as FREE (overrides price)
                  </label>
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active (visible to students)
                  </label>
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isImportantUpdate || false} onChange={e => setForm(f => ({ ...f, isImportantUpdate: e.target.checked }))} />
                    Important Update
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Series' : 'Create Series'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
