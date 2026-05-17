import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

const API = 'http://localhost:5000/api';
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` });
const emptyForm = { title: '', description: '', duration: 60, isActive: true };

export default function TestsAdmin() {
  const { seriesId } = useParams();
  const [tests, setTests] = useState([]);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/tests/admin/series/${seriesId}`, { headers: headers() }).then(r => r.json()),
      fetch(`${API}/test-series/${seriesId}`).then(r => r.json()),
    ]).then(([tData, sData]) => {
      setTests(tData.data || []);
      setSeries(sData.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [seriesId]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (t) => { setEditing(t); setForm({ title: t.title, description: t.description || '', duration: t.duration, isActive: t.isActive }); setError(''); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      const body = { ...form, testSeries: seriesId, duration: Number(form.duration) };
      const url = editing ? `${API}/tests/${editing._id}` : `${API}/tests`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) { setError(data.message); }
      else { setShowForm(false); window.location.reload(); }
    } catch { setError('Save failed.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this test? All questions inside it will also be deleted.')) return;
    await fetch(`${API}/tests/${id}`, { method: 'DELETE', headers: headers() });
    setTests(tests.filter(t => t._id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
            <Link to="/admin/test-series" style={{ color: '#6DBE45' }}>Test Series</Link> → {series?.title || '...'}
          </nav>
          <h2>Tests in this Series</h2>
          <p>{series?.category} • {series?.difficulty} • {tests.length} tests</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>+ Add Test</button>
      </div>

      {loading ? <div className="admin-loading">Loading...</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Test Title</th><th>Duration</th><th>Questions</th><th>Total Marks</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {tests.map((t, idx) => (
                <tr key={t._id}>
                  <td>{idx + 1}</td>
                  <td className="font-medium">{t.title}</td>
                  <td>{t.duration} min</td>
                  <td>{t.totalQuestions || 0}</td>
                  <td>{t.totalMarks || 0}</td>
                  <td><span className={`admin-badge ${t.isActive ? 'admin-badge-green' : 'admin-badge-red'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/admin/test-series/${seriesId}/tests/${t._id}/questions`} className="admin-btn admin-btn-sm admin-btn-primary">Questions</Link>
                      <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => openEdit(t)}>Edit</button>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {tests.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No tests yet. Add the first test!</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Test' : 'Add Test'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              {error && <div className="admin-error">{error}</div>}
              <div className="admin-form-grid">
                <div className="admin-form-group admin-full-width">
                  <label>Test Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Mock Test 1 - Full Length" />
                </div>
                <div className="admin-form-group admin-full-width">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Optional description..." />
                </div>
                <div className="admin-form-group">
                  <label>Duration (minutes) *</label>
                  <input type="number" min="5" max="300" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active (visible to students)
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Test' : 'Add Test'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
