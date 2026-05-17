import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

const API = 'http://localhost:5000/api';
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` });

const emptyQ = { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', marks: 1, negativeMarks: 0.25, subject: 'General' };

export default function QuestionsAdmin() {
  const { seriesId, testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyQ);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [addAnother, setAddAnother] = useState(true);
  const [saveCount, setSaveCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/questions/admin/test/${testId}`, { headers: headers() }).then(r => r.json()),
      fetch(`${API}/tests/${testId}`).then(r => r.json()),
    ]).then(([qData, tData]) => {
      setQuestions(qData.data || []);
      setTest(tData.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [testId, saveCount]);

  const openCreate = () => { setEditing(null); setForm({ ...emptyQ }); setError(''); setShowForm(true); };
  const openEdit = (q) => {
    setEditing(q);
    setForm({ questionText: q.questionText, options: [...q.options], correctAnswer: q.correctAnswer, explanation: q.explanation || '', marks: q.marks, negativeMarks: q.negativeMarks, subject: q.subject });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.questionText.trim()) { setError('Question text is required.'); return; }
    if (form.options.some(o => !o.trim())) { setError('All 4 options are required.'); return; }
    setSaving(true);
    try {
      const body = { ...form, test: testId, options: form.options, correctAnswer: Number(form.correctAnswer), marks: Number(form.marks), negativeMarks: Number(form.negativeMarks) };
      const url = editing ? `${API}/questions/${editing._id}` : `${API}/questions`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) { setError(data.message); }
      else {
        setSaveCount(c => c + 1);
        if (addAnother && !editing) {
          setForm({ ...emptyQ, subject: form.subject, marks: form.marks, negativeMarks: form.negativeMarks });
          setError('');
        } else {
          setShowForm(false);
        }
      }
    } catch { setError('Save failed.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`${API}/questions/${id}`, { method: 'DELETE', headers: headers() });
    setSaveCount(c => c + 1);
  };

  const updateOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
            <Link to="/admin/test-series" style={{ color: '#6DBE45' }}>Test Series</Link> →{' '}
            <Link to={`/admin/test-series/${seriesId}/tests`} style={{ color: '#6DBE45' }}>{test?.testSeries?.title || 'Tests'}</Link> →{' '}
            {test?.title || '...'}
          </nav>
          <h2>Questions ({questions.length})</h2>
          <p>{test?.duration} min • {test?.totalMarks || 0} total marks</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>+ Add Question</button>
      </div>

      {loading ? <div className="admin-loading">Loading questions...</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Question</th><th>Subject</th><th>Marks</th><th>Neg.</th><th>Explanation</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q._id}>
                  <td>{q.questionNumber || idx + 1}</td>
                  <td className="max-w-xs" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.questionText}</td>
                  <td><span className="admin-badge admin-badge-blue">{q.subject}</span></td>
                  <td><span className="admin-badge admin-badge-green">+{q.marks}</span></td>
                  <td><span className="admin-badge admin-badge-red">-{q.negativeMarks}</span></td>
                  <td>{q.explanation ? <span className="admin-badge admin-badge-green">✓</span> : <span className="admin-badge admin-badge-yellow">—</span>}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => openEdit(q)}>Edit</button>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(q._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No questions yet. Add the first question!</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Question' : `Add Question (Q${questions.length + 1})`}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              {error && <div className="admin-error">{error}</div>}
              <div className="admin-form-grid">
                <div className="admin-form-group admin-full-width">
                  <label>Question Text *</label>
                  <textarea value={form.questionText} onChange={e => setForm(f => ({ ...f, questionText: e.target.value }))}
                    rows={3} placeholder="Type the question here..." />
                </div>

                <div className="admin-form-group admin-full-width">
                  <label>Answer Options * <span style={{ color: '#6b7280', fontSize: '12px' }}>— select the correct one</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['A', 'B', 'C', 'D'].map((letter, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px', cursor: 'pointer', fontWeight: form.correctAnswer === idx ? '600' : '400', color: form.correctAnswer === idx ? '#16a34a' : '#374151' }}>
                          <input type="radio" name="correctAnswer" checked={form.correctAnswer === idx} onChange={() => setForm(f => ({ ...f, correctAnswer: idx }))} style={{ accentColor: '#6DBE45' }} />
                          Option {letter}
                        </label>
                        <input value={form.options[idx]} onChange={e => updateOption(idx, e.target.value)}
                          placeholder={`Option ${letter}`}
                          style={{ flex: 1, padding: '8px 12px', border: `2px solid ${form.correctAnswer === idx ? '#6DBE45' : '#e5e7eb'}`, borderRadius: '8px', outline: 'none' }} />
                        {form.correctAnswer === idx && <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>✓ Correct</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-form-group admin-full-width">
                  <label>Explanation <span style={{ color: '#6b7280', fontSize: '12px' }}>— shown to students after test (recommended)</span></label>
                  <textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                    rows={2} placeholder="Explain why the correct answer is correct..." />
                </div>

                <div className="admin-form-group">
                  <label>Subject / Topic</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics, GK, English" />
                </div>

                <div className="admin-form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label>Marks per Question</label>
                    <input type="number" min="0.5" step="0.5" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} />
                  </div>
                  <div>
                    <label>Negative Marks</label>
                    <input type="number" min="0" step="0.25" value={form.negativeMarks} onChange={e => setForm(f => ({ ...f, negativeMarks: e.target.value }))} />
                  </div>
                </div>

                {!editing && (
                  <div className="admin-form-group admin-full-width">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={addAnother} onChange={e => setAddAnother(e.target.checked)} style={{ accentColor: '#6DBE45' }} />
                      Save & add another question (keep adding until done)
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowForm(false)}>Close</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Question' : addAnother ? 'Save & Add Another →' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
