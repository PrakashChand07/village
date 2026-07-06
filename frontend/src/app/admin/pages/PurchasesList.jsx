import { useState, useEffect } from 'react';
import { getAdminPurchases } from '../../../services/admin-api';
import { 
  Search, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  User, 
  BookOpen, 
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function PurchasesList() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, success, pending, failed

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await getAdminPurchases();
      const purchaseData = res.data.data || [];
      setPurchases(purchaseData);
      setFilteredPurchases(purchaseData);
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Filter purchases
  useEffect(() => {
    let result = purchases;

    // Search term filter (User details, Test Series details, Razorpay IDs)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.user?.name?.toLowerCase().includes(term) ||
        p.user?.email?.toLowerCase().includes(term) ||
        p.user?.phone?.toLowerCase().includes(term) ||
        p.testSeries?.title?.toLowerCase().includes(term) ||
        p.razorpayOrderId?.toLowerCase().includes(term) ||
        p.razorpayPaymentId?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    setFilteredPurchases(result);
  }, [searchTerm, statusFilter, purchases]);

  // Statistics calculations
  const totalPurchases = purchases.length;
  const successfulPurchases = purchases.filter(p => p.status === 'success');
  const pendingPurchases = purchases.filter(p => p.status === 'pending');
  const failedPurchases = purchases.filter(p => p.status === 'failed');

  const totalRevenue = successfulPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div style={{ padding: '0.5rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Purchases & Payments</h1>
        <p style={{ color: 'var(--gray)', marginTop: '0.25rem' }}>Track, audit, and analyze student purchases and Razorpay payment details</p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        {/* Total Revenue card */}
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
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#14532d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#14532d', marginTop: '2px' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Total Orders card */}
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
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', marginTop: '2px' }}>{totalPurchases}</div>
          </div>
        </div>

        {/* Successful Transactions card */}
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
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#115e59', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Successful</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#115e59', marginTop: '2px' }}>{successfulPurchases.length}</div>
          </div>
        </div>

        {/* Pending Transactions card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
          border: '1px solid #fde68a',
          borderRadius: 16, 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ background: '#d97706', color: '#fff', borderRadius: 12, padding: '0.75rem', display: 'flex' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending / Failed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#78350f', marginTop: '2px' }}>{pendingPurchases.length + failedPurchases.length}</div>
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
            placeholder="Search by student name, email, test series title, or transaction ID..." 
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

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 500 }}>Payment Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: 10, border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem', outline: 'none' }}
          >
            <option value="all">All Payments</option>
            <option value="success">Success Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Loading payment logs...</p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '23%' }}>Student Details</th>
                  <th style={{ width: '25%' }}>Test Series</th>
                  <th style={{ width: '10%' }}>Amount Paid</th>
                  <th style={{ width: '20%' }}>Payment IDs (Razorpay)</th>
                  <th style={{ width: '10%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase._id} style={{ transition: 'background-color 0.2s' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                        <Calendar size={14} style={{ color: 'var(--gray)' }} />
                        <span>
                          {purchase.purchasedAt || purchase.createdAt
                            ? new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {purchase.user ? (
                        <div style={{ display: 'grid', gap: '2px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={13} style={{ color: 'var(--gray)' }} /> {purchase.user.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{purchase.user.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{purchase.user.phone}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#b91c1c', fontStyle: 'italic' }}>Deleted User</span>
                      )}
                    </td>
                    <td>
                      {purchase.testSeries ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookOpen size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ fontWeight: 500, color: 'var(--dark)' }}>{purchase.testSeries.title}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#b91c1c', fontStyle: 'italic' }}>Deleted Series</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: purchase.status === 'success' ? '#16a34a' : 'var(--dark)', fontSize: '1rem' }}>
                      ₹{purchase.amount}
                    </td>
                    <td>
                      <div style={{ display: 'grid', gap: '2px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                          <CreditCard size={12} style={{ color: 'var(--gray)' }} />
                          <span>Order: {purchase.razorpayOrderId || 'N/A'}</span>
                        </div>
                        {purchase.razorpayPaymentId && (
                          <div style={{ color: '#0f766e', fontWeight: 600 }}>
                            Pay ID: {purchase.razorpayPaymentId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {purchase.status === 'success' ? (
                        <span className="status-badge status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Success
                        </span>
                      ) : purchase.status === 'pending' ? (
                        <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> Pending
                        </span>
                      ) : (
                        <span className="status-badge" style={{ background: '#fee2e2', color: '#991b1b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredPurchases.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: '4rem' }}>
                      <AlertCircle size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                      <div>No purchases match the search criteria.</div>
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
