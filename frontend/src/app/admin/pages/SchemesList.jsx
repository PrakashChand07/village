import { useState, useEffect } from 'react';
import { getAdminSchemes, createScheme, updateScheme, deleteScheme, toggleScheme, getAdminCategories } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X, Type, Link, Minus, Heading } from 'lucide-react';

const EMPTY_FORM = {
  title: '', description: '', benefit: '', eligibility: '',
  category: '', applyLink: '', isImportantUpdate: false,
  blocks: [],
};

// ─── Block Builder Component ──────────────────────────────
import BlockBuilder from '../components/BlockBuilder';


// ─── Main Component ───────────────────────────────────────
export default function SchemesList() {
  const [items, setItems] = useState([]);
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
      const res = await getAdminSchemes({ limit: 100 });
      setItems(res.data.data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ type: 'scheme' });
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
  };

  useEffect(() => { fetchData(); fetchCategories(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ ...EMPTY_FORM, blocks: [] }); setError(''); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item, blocks: item.blocks || [] }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editItem) await updateScheme(editItem._id, form);
      else await createScheme(form);
      closeModal(); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle scheme status?')) { await toggleScheme(id); fetchData(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scheme?')) { await deleteScheme(id); fetchData(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Village Schemes</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Scheme
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Title</th><th>Category</th><th>Benefit</th><th>Blocks</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.benefit}</td>
                  <td><span style={{ fontSize: 12, background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{item.blocks?.length || 0} blocks</span></td>
                  <td><span className={`status-badge ${item.isActive ? 'status-active' : 'status-inactive'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Toggle" onClick={() => handleToggle(item._id)}><Power size={16} /></button>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(item)}><Edit size={16} /></button>
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No schemes found. Add your first!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 780, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editItem ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. PM Awas Yojana" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Brief description of the scheme..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Benefit *</label>
                <input className="form-input" name="benefit" value={form.benefit} onChange={handleChange} required placeholder="e.g. ₹1.2 Lakh financial aid" />
              </div>
              <div className="form-group">
                <label className="form-label">Eligibility *</label>
                <input className="form-input" name="eligibility" value={form.eligibility} onChange={handleChange} required placeholder="e.g. BPL families" />
              </div>
              <div className="form-group">
                <label className="form-label">Apply Link</label>
                <input className="form-input" name="applyLink" value={form.applyLink} onChange={handleChange} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input type="checkbox" name="isImportantUpdate" id="scIsImportant" checked={form.isImportantUpdate || false} onChange={handleChange} />
                <label htmlFor="scIsImportant" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Important Update</label>
              </div>

              {/* Block Builder */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Detail Page Content Blocks
                  <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400, marginLeft: 8 }}>— Shown when user clicks on this scheme</span>
                </label>
                <BlockBuilder
                  blocks={form.blocks || []}
                  onChange={(blocks) => setForm(f => ({ ...f, blocks }))}
                  theme="green"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : editItem ? 'Update Scheme' : 'Add Scheme'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
