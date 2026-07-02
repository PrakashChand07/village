import { useEffect, useState } from 'react';
import { Briefcase, Award, GraduationCap, Home } from 'lucide-react';
import { getAdminJobs, getAdminResults, getAdminScholarships, getAdminSchemes } from '../../../services/admin-api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    jobs: 0,
    results: 0,
    scholarships: 0,
    schemes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, resultsRes, scholarshipsRes, schemesRes] = await Promise.all([
          getAdminJobs({ limit: 1 }),
          getAdminResults({ limit: 1 }),
          getAdminScholarships({ limit: 1 }),
          getAdminSchemes({ limit: 1 })
        ]);

        setStats({
          jobs: jobsRes.data.total,
          results: resultsRes.data.total,
          scholarships: scholarshipsRes.data.total,
          schemes: schemesRes.data.total,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Loading Dashboard...</p></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#4F46E5', background: 'rgba(79, 70, 229, 0.1)' }}>
            <Briefcase />
          </div>
          <div className="stat-info">
            <h3>Total Jobs</h3>
            <p>{stats.jobs}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Award />
          </div>
          <div className="stat-info">
            <h3>Total Results</h3>
            <p>{stats.results}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
            <GraduationCap />
          </div>
          <div className="stat-info">
            <h3>Scholarships</h3>
            <p>{stats.scholarships}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#EC4899', background: 'rgba(236, 72, 153, 0.1)' }}>
            <Home />
          </div>
          <div className="stat-info">
            <h3>Sarkari Yojna</h3>
            <p>{stats.schemes}</p>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray)' }}>
        <h2 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Welcome to Village Help Admin Panel</h2>
        <p>Use the sidebar to navigate and manage different sections of the website.</p>
      </div>
    </div>
  );
}
