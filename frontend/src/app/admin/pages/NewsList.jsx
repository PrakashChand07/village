import { useState, useEffect } from 'react';
import { getAdminNews, createNews, updateNews, deleteNews, toggleNews, getAdminCategories } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X, ChevronLeft, ChevronRight, Type, Link, Minus, Heading } from 'lucide-react';

const EMPTY_FORM = {
  title: '', content: '', category: '', source: '', date: '', isNewPost: true,
  blocks: [],
};

import BlockBuilder from '../components/BlockBuilder';


// ─── Main Component ───────────────────────────────────────
export default function NewsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminNews({ page: p, limit: 10 });
      setItems(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ type: 'news' });
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
  };

  useEffect(() => { fetchData(); fetchCategories(); }, []);

  const changePage = (p) => { setPage(p); fetchData(p); };

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
      if (editItem) await updateNews(editItem._id, form);
      else await createNews(form);
      closeModal(); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle news status?')) { await toggleNews(id); fetchData(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this news item?')) { await deleteNews(id); fetchData(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage News <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 400 }}>({total} total)</span></h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add News
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <>
            <table>
              <thead><tr>
                <th>Title</th><th>Category</th><th>Source</th><th>Date</th><th>Blocks</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 500, maxWidth: 240 }}>
                      {item.title}
                      {item.isNewPost && <span style={{ marginLeft: 8, fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4 }}>NEW</span>}
                    </td>
                    <td>{item.category}</td>
                    <td>{item.source || '—'}</td>
                    <td>{item.date}</td>
                    <td><span style={{ fontSize: 12, background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{item.blocks?.length || 0} blocks</span></td>
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
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No news found. Add your first!</td></tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0 0.5rem' }}>
                <button onClick={() => changePage(page - 1)} disabled={page === 1} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}>
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => changePage(i + 1)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, background: page === i + 1 ? 'var(--primary)' : '#f3f4f6', color: page === i + 1 ? '#fff' : 'var(--dark)' }}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 780, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editItem ? 'Edit News' : 'Add News'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Bihar Board Result 2026 Announced" />
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
                  <input className="form-input" name="date" value={form.date} onChange={handleChange} required placeholder="e.g. 06 May 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <input className="form-input" name="source" value={form.source} onChange={handleChange} placeholder="e.g. Jagran, NDTV" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Summary / Intro *</label>
                  <textarea className="form-input" name="content" value={form.content} onChange={handleChange} required rows={3} placeholder="Brief summary shown in news list..." style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="isNewPost" id="isNewPost" checked={form.isNewPost} onChange={handleChange} />
                  <label htmlFor="isNewPost" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mark as NEW</label>
                </div>
              </div>

              {/* Block Builder */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Detail Page Content Blocks
                  <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400, marginLeft: 8 }}>— Shown when user clicks on this news</span>
                </label>
                <BlockBuilder
                  blocks={form.blocks || []}
                  onChange={(blocks) => setForm(f => ({ ...f, blocks }))}
                  theme="blue"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : editItem ? 'Update News' : 'Add News'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
