import { useState, useEffect } from 'react';
import { getAdminResults, createResult, updateResult, deleteResult, toggleResult, getAdminCategories } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X } from 'lucide-react';

const EMPTY_FORM = {
  title: '', organization: '', date: '', status: 'Awaited',
  category: 'Board', resultLink: '', downloadLink: '', isNewPost: true,
};
const STATUSES = ['Declared', 'Awaited', 'Expected Soon'];

export default function ResultsList() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminResults({ limit: 100 });
      setResults(res.data.data || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ type: 'result' });
      const cats = res.data.data || [];
      setCategories(cats);
      if (cats.length > 0 && !form.category && !editItem) {
        setForm(f => ({ ...f, category: cats[0].name }));
      }
    } catch { setCategories([]); }
  };

  useEffect(() => { 
    fetchData(); 
    fetchCategories();
  }, []);

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editItem) await updateResult(editItem._id, form);
      else await createResult(form);
      closeModal(); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle result status?')) { await toggleResult(id); fetchData(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this result?')) { await deleteResult(id); fetchData(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Results</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Result
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Title</th><th>Organization</th><th>Category</th><th>Date</th><th>Status</th><th>Active</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {results.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 500 }}>
                    {item.title}
                    {item.isNewPost && <span style={{ marginLeft: 8, fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4 }}>NEW</span>}
                  </td>
                  <td>{item.organization}</td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'Declared' ? 'status-active' : 'status-inactive'}`}>{item.status}</span>
                  </td>
                  <td><span className={`status-badge ${item.isActive ? 'status-active' : 'status-inactive'}`}>{item.isActive ? 'Yes' : 'No'}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Toggle" onClick={() => handleToggle(item._id)}><Power size={16} /></button>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(item)}><Edit size={16} /></button>
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No results found. Add your first result!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editItem ? 'Edit Result' : 'Add New Result'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Bihar Board 12th Result 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization *</label>
                  <input className="form-input" name="organization" value={form.organization} onChange={handleChange} required placeholder="e.g. BSEB" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" name="date" value={form.date} onChange={handleChange} required placeholder="e.g. 28 Apr 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select className="form-input" name="status" value={form.status} onChange={handleChange} required>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Result Link</label>
                  <input className="form-input" name="resultLink" value={form.resultLink} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Download Link</label>
                  <input className="form-input" name="downloadLink" value={form.downloadLink} onChange={handleChange} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="isNewPost" id="rIsNew" checked={form.isNewPost} onChange={handleChange} />
                  <label htmlFor="rIsNew" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mark as NEW</label>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : editItem ? 'Update Result' : 'Add Result'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
