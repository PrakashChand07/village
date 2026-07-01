import { useState, useEffect } from 'react';
import { getAdminScholarships, createScholarship, updateScholarship, deleteScholarship, toggleScholarship, getAdminCategories } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X, Type, Link, Minus, Heading } from 'lucide-react';

const EMPTY_FORM = {
  title: '', amount: '', eligibility: '', deadline: '',
  provider: '', category: '', applicants: '0', applyLink: '', isNewPost: true, isImportantUpdate: false,
  blocks: [],
};

import BlockBuilder from '../components/BlockBuilder';

// ─── Main Component ───────────────────────────────────────
export default function ScholarshipsList() {
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
      const res = await getAdminScholarships({ limit: 100 });
      setItems(res.data.data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ type: 'scholarship' });
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
      if (editItem) await updateScholarship(editItem._id, form);
      else await createScholarship(form);
      closeModal(); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle scholarship status?')) { await toggleScholarship(id); fetchData(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scholarship?')) { await deleteScholarship(id); fetchData(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Scholarships</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Scholarship
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Title</th><th>Provider</th><th>Category</th><th>Amount</th><th>Deadline</th><th>Blocks</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 500 }}>
                    {item.title}
                    {item.isNewPost && <span style={{ marginLeft: 8, fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4 }}>NEW</span>}
                  </td>
                  <td>{item.provider}</td>
                  <td>{item.category}</td>
                  <td>{item.amount}</td>
                  <td>{item.deadline}</td>
                  <td><span style={{ fontSize: 12, background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{item.blocks?.length || 0} blocks</span></td>
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
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No scholarships found. Add your first!</td></tr>
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
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editItem ? 'Edit Scholarship' : 'Add Scholarship'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Post Matric Scholarship 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Provider *</label>
                  <input className="form-input" name="provider" value={form.provider} onChange={handleChange} required placeholder="e.g. Bihar Government" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount *</label>
                  <input className="form-input" name="amount" value={form.amount} onChange={handleChange} required placeholder="e.g. ₹10,000 - ₹20,000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline *</label>
                  <input className="form-input" name="deadline" value={form.deadline} onChange={handleChange} required placeholder="e.g. 30 May 2026" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Eligibility *</label>
                  <input className="form-input" name="eligibility" value={form.eligibility} onChange={handleChange} required placeholder="e.g. 10th Pass, SC/ST Category" />
                </div>
                <div className="form-group">
                  <label className="form-label">Applicants</label>
                  <input className="form-input" name="applicants" value={form.applicants} onChange={handleChange} placeholder="e.g. 50,000+" />
                </div>
                <div className="form-group">
                  <label className="form-label">Apply Link</label>
                  <input className="form-input" name="applyLink" value={form.applyLink} onChange={handleChange} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', gridColumn: '1/-1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isNewPost" id="sIsNew" checked={form.isNewPost} onChange={handleChange} />
                    <label htmlFor="sIsNew" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mark as NEW</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isImportantUpdate" id="sIsImportant" checked={form.isImportantUpdate || false} onChange={handleChange} />
                    <label htmlFor="sIsImportant" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Important Update</label>
                  </div>
                </div>
              </div>

              {/* Block Builder */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Detail Page Content Blocks
                  <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400, marginLeft: 8 }}>— Shown when user clicks on this scholarship</span>
                </label>
                <BlockBuilder
                  blocks={form.blocks || []}
                  onChange={(blocks) => setForm(f => ({ ...f, blocks }))}
                  theme="purple"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : editItem ? 'Update Scholarship' : 'Add Scholarship'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
