import { useState, useEffect } from 'react';
import { getAdminStudyMaterials, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial, toggleStudyMaterial } from '../../../services/admin-api';
import { Edit, Trash2, Plus, Power, X, FileText } from 'lucide-react';

const EMPTY_FORM = {
  title: '', subject: '', category: 'Previous Paper', description: '', isActive: true,
};

export default function StudyMaterialAdmin() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = ['Previous Paper', 'Mock Test Paper', 'Study Notes'];

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await getAdminStudyMaterials({ limit: 100 });
      setMaterials(res.data.data || []);
    } catch { setMaterials([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchMaterials(); 
  }, []);

  const openAdd = () => { setEditMaterial(null); setForm(EMPTY_FORM); setFile(null); setError(''); setShowModal(true); };
  const openEdit = (material) => { setEditMaterial(material); setForm({ ...material }); setFile(null); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editMaterial && !file) {
      setError('PDF File is required');
      return;
    }

    setSaving(true); setError('');
    
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    formData.append('type', 'PDF'); // Always PDF
    
    if (file) {
      formData.append('file', file);
    }

    try {
      if (editMaterial) await updateStudyMaterial(editMaterial._id, formData);
      else await createStudyMaterial(formData);
      closeModal();
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    if (window.confirm('Toggle material status?')) { await toggleStudyMaterial(id); fetchMaterials(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) { await deleteStudyMaterial(id); fetchMaterials(); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Study Material</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Material
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Title</th><th>Subject</th><th>Category</th><th>Downloads</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material._id}>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} style={{ color: '#6DBE45' }} />
                      {material.title}
                    </div>
                  </td>
                  <td>{material.subject}</td>
                  <td><span className="badge" style={{ background: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{material.category}</span></td>
                  <td>{material.downloads}</td>
                  <td><span className={`status-badge ${material.isActive ? 'status-active' : 'status-inactive'}`}>{material.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" title="Toggle" onClick={() => handleToggle(material._id)}><Power size={16} /></button>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(material)}><Edit size={16} /></button>
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(material._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No materials found. Add your first study material!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{editMaterial ? 'Edit Material' : 'Add Material'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. SSC CGL Physics Notes" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input className="form-input" name="subject" value={form.subject} onChange={handleChange} required placeholder="e.g. Physics" />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Category *</label>
                  <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." rows="3"></textarea>
                </div>
                
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Upload PDF File {(!editMaterial) && '*'}</label>
                  <input type="file" className="form-input" name="file" onChange={handleFileChange} accept=".pdf" style={{ padding: '0.5rem' }} />
                  {editMaterial && editMaterial.fileUrl && !file && (
                    <small style={{ color: '#6b7280', display: 'block', marginTop: '0.5rem' }}>
                      Current file: {editMaterial.fileUrl.split('/').pop()}
                    </small>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1/-1' }}>
                  <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} />
                  <label htmlFor="isActive" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Active (Visible to users)</label>
                </div>
              </div>
              
              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={saving}>
                {saving ? 'Saving...' : editMaterial ? 'Update Material' : 'Upload Material'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
