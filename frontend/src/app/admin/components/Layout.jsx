import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Layout() {
  const { admin } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{admin?.name}</div>
              <div style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{admin?.email}</div>
            </div>
            <div className="avatar">
              <User size={20} />
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
