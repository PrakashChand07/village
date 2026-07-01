import { useState, useEffect } from 'react';
import { getAdminJobs, createJob, updateJob, deleteJob, toggleJob, getAdminCategories } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X, Type, Link, Minus, Heading } from 'lucide-react';

const EMPTY_FORM = {
  title: '', organization: '', posts: '', lastDate: '', location: '',
  category: '', salary: '', qualification: '', applyLink: '', isNewPost: true, isImportantUpdate: false,
  blocks: [],
};

import BlockBuilder from '../components/BlockBuilder';

// ─── Main Component ───────────────────────────────────────
export default function JobsList() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [categories, setCategories] = useState([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAdminJobs({ limit: 100 });
      setJobs(res.data.data || []);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories({ type: 'job' });
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
  };

  useEffect(() => { fetchJobs(); fetchCategories(); }, []);

  const openAdd  = () => { setEditJob(null); setForm({ ...EMPTY_FORM, blocks: [] }); setError(''); setShowModal(true); };
  const openEdit = (job) => { setEditJob(job); setForm({ ...job, blocks: job.blocks || [] }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editJob) await updateJob(editJob._id, form);
      else await createJob(form);
      closeModal(); fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle job status?')) { await toggleJob(id); fetchJobs(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) { await deleteJob(id); fetchJobs(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Government Jobs</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Job
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Title</th><th>Organization</th><th>Category</th><th>Last Date</th><th>Blocks</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td style={{ fontWeight: 500 }}>
                    {job.title}
                    {job.isNewPost && <span style={{ marginLeft: 8, fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4 }}>NEW</span>}
                  </td>
                  <td>{job.organization}</td>
                  <td>{job.category}</td>
                  <td>{job.lastDate}</td>
                  <td><span style={{ fontSize: 12, background: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{job.blocks?.length || 0} blocks</span></td>
                  <td><span className={`status-badge ${job.isActive ? 'status-active' : 'status-inactive'}`}>{job.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Toggle" onClick={() => handleToggle(job._id)}><Power size={16} /></button>
                      <button className="btn-icon" title="Edit"   onClick={() => openEdit(job)}><Edit size={16} /></button>
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(job._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No jobs found. Add your first job!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 880, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editJob ? 'Edit Job' : 'Add New Job'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Bihar Police Constable 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization *</label>
                  <input className="form-input" name="organization" value={form.organization} onChange={handleChange} required placeholder="e.g. Bihar Police" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Posts *</label>
                  <input className="form-input" name="posts" value={form.posts} onChange={handleChange} required placeholder="e.g. 5000 Posts" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Date *</label>
                  <input className="form-input" name="lastDate" value={form.lastDate} onChange={handleChange} required placeholder="e.g. 15 May 2026" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-input" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Bihar" />
                </div>
                <div className="form-group">
                  <label className="form-label">Salary *</label>
                  <input className="form-input" name="salary" value={form.salary} onChange={handleChange} required placeholder="e.g. ₹21,700 - ₹69,100" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Qualification *</label>
                  <input className="form-input" name="qualification" value={form.qualification} onChange={handleChange} required placeholder="e.g. 12th Pass" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Apply Link</label>
                  <input className="form-input" name="applyLink" value={form.applyLink} onChange={handleChange} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', gridColumn: '1/-1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isNewPost" id="jIsNew" checked={form.isNewPost} onChange={handleChange} />
                    <label htmlFor="jIsNew" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mark as NEW</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isImportantUpdate" id="jIsImportant" checked={form.isImportantUpdate || false} onChange={handleChange} />
                    <label htmlFor="jIsImportant" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Important Update</label>
                  </div>
                </div>
              </div>

              {/* Block Builder */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Detail Page Content Blocks
                  <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400, marginLeft: 8 }}>— Shown when user clicks on this job</span>
                </label>
                <BlockBuilder
                  blocks={form.blocks || []}
                  onChange={(blocks) => setForm(f => ({ ...f, blocks }))}
                  theme="orange"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : editJob ? 'Update Job' : 'Add Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
