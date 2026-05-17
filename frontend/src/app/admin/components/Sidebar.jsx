import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Home, 
  Layers,
  Newspaper,
  Mail,
  LogOut,
  BookOpen
} from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Admin Panel</div>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
          <LayoutDashboard className="nav-icon" /> Dashboard
        </NavLink>
        <NavLink to="/admin/jobs" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Briefcase className="nav-icon" /> Government Jobs
        </NavLink>
        <NavLink to="/admin/results" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Award className="nav-icon" /> Results
        </NavLink>
        <NavLink to="/admin/scholarships" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <GraduationCap className="nav-icon" /> Scholarships
        </NavLink>
        <NavLink to="/admin/schemes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Home className="nav-icon" /> Village Schemes
        </NavLink>
        <NavLink to="/admin/news" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Newspaper className="nav-icon" /> News
        </NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Layers className="nav-icon" /> Categories
        </NavLink>
        <NavLink to="/admin/contacts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Mail className="nav-icon" /> Contact Messages
        </NavLink>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', margin: '8px 0', padding: '4px 0' }}>
          <div style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>Test Series</div>
        </div>
        <NavLink to="/admin/test-series" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <BookOpen className="nav-icon" /> Test Series
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
