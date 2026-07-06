import { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus } from '../../../services/admin-api';
import { 
  Search, 
  UserCheck, 
  UserMinus, 
  CheckCircle, 
  XCircle, 
  Users,
  ShieldCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, blocked
  const [verifyFilter, setVerifyFilter] = useState('all'); // all, verified, unverified

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      const userData = res.data.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = users;

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.name?.toLowerCase().includes(term) || 
        u.email?.toLowerCase().includes(term) || 
        u.phone?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const wantActive = statusFilter === 'active';
      result = result.filter(u => u.isActive === wantActive);
    }

    // Verification filter
    if (verifyFilter !== 'all') {
      const wantVerified = verifyFilter === 'verified';
      result = result.filter(u => u.isVerified === wantVerified);
    }

    setFilteredUsers(result);
  }, [searchTerm, statusFilter, verifyFilter, users]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      if (res.data.success) {
        setUsers(prev => 
          prev.map(u => u._id === id ? { ...u, isActive: res.data.data.isActive } : u)
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;

  return (
    <div style={{ padding: '0.5rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Registered Users</h1>
        <p style={{ color: 'var(--gray)', marginTop: '0.25rem' }}>View, manage, and toggle status of all registered students</p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
          border: '1px solid #bfdbfe',
          borderRadius: 16, 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ background: '#3b82f6', color: '#fff', borderRadius: 12, padding: '0.75rem', display: 'flex' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Registered</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', marginTop: '2px' }}>{totalUsers}</div>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
          border: '1px solid #bbf7d0',
          borderRadius: 16, 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ background: '#22c55e', color: '#fff', borderRadius: 12, padding: '0.75rem', display: 'flex' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#14532d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Verified</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#14532d', marginTop: '2px' }}>{verifiedUsers}</div>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', 
          border: '1px solid #99f6e4',
          borderRadius: 16, 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ background: '#0d9488', color: '#fff', borderRadius: 12, padding: '0.75rem', display: 'flex' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#115e59', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Accounts</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#115e59', marginTop: '2px' }}>{activeUsers}</div>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', 
          border: '1px solid #fed7aa',
          borderRadius: 16, 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ background: '#f97316', color: '#fff', borderRadius: 12, padding: '0.75rem', display: 'flex' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7c2d12', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unverified</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#7c2d12', marginTop: '2px' }}>{unverifiedUsers}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        padding: '1.25rem', 
        marginBottom: '1.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 2.75rem', 
              border: '1px solid var(--border)', 
              borderRadius: 12, 
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: '#f9fafb'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>Account:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: 10, border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>Email:</span>
            <select 
              value={verifyFilter} 
              onChange={(e) => setVerifyFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: 10, border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Loading user directory...</p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Joined Date</th>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '25%' }}>Email</th>
                  <th style={{ width: '15%' }}>Phone</th>
                  <th style={{ width: '10%' }}>Verification</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} style={{ transition: 'background-color 0.2s' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                        <Calendar size={14} style={{ color: 'var(--gray)' }} />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--dark)' }}>{user.name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} style={{ color: 'var(--gray)' }} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={14} style={{ color: 'var(--gray)' }} />
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td>
                      {user.isVerified ? (
                        <span className="status-badge status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Verified
                        </span>
                      ) : (
                        <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={12} /> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      <div onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: user.isActive ? '#fee2e2' : '#dcfce7',
                            color: user.isActive ? '#b91c1c' : '#15803d',
                          }}
                          title={user.isActive ? "Block student account" : "Unblock student account"}
                        >
                          {user.isActive ? (
                            <>
                              <UserMinus size={14} /> Block
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} /> Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '4rem' }}>
                      <UserX size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                      <div>No registered users match the search criteria.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
