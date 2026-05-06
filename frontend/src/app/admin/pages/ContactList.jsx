import { useState, useEffect } from 'react';
import { getAdminContacts, markContactAsRead, deleteAdminContact } from '../../../services/admin-api';
import { Trash2, CheckCircle, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchContacts = async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminContacts({ page: p, limit: 10 });
      setContacts(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const changePage = (p) => {
    setPage(p);
    fetchContacts(p);
  };

  const handleOpenContact = async (contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      try {
        await markContactAsRead(contact._id);
        // Update local state to reflect read status
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, isRead: true } : c))
        );
      } catch (error) {
        console.error("Failed to mark as read");
      }
    }
  };

  const closeModal = () => {
    setSelectedContact(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteAdminContact(id);
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          closeModal();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Contact Messages <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 400 }}>({total} total)</span>
        </h1>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Message Preview</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    style={{
                      fontWeight: contact.isRead ? 'normal' : 'bold',
                      backgroundColor: contact.isRead ? 'transparent' : '#f0fdf4',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenContact(contact)}
                  >
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>{contact.name}</td>
                    <td>{contact.phone}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.message}
                    </td>
                    <td>
                      {contact.isRead ? (
                        <span className="status-badge status-active">Read</span>
                      ) : (
                        <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e' }}>New</span>
                      )}
                    </td>
                    <td>
                      <div className="action-btns" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-icon" title="View" onClick={() => handleOpenContact(contact)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(contact._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0 0.5rem' }}>
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => changePage(i + 1)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700,
                      background: page === i + 1 ? 'var(--primary)' : '#f3f4f6',
                      color: page === i + 1 ? '#fff' : 'var(--dark)',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedContact && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>Message Details</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                  Received: {new Date(selectedContact.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'grid', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 12 }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{selectedContact.name}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label>
                  <div style={{ fontWeight: 500 }}>{selectedContact.phone}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <div style={{ fontWeight: 500 }}>{selectedContact.email || 'N/A'}</div>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Message</label>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: 8, border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => handleDelete(selectedContact._id)}
                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Trash2 size={16} /> Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
