/* eslint-disable no-unused-vars */
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Users, LogOut, Home, ChevronRight, Tag
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/posts', label: 'Posts', icon: FileText },
    { path: '/admin/categories', label: 'Categories', icon: Tag },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div style={{ padding: '12px 14px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
            🍽️ TheDailyFoodOfficial
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Admin Panel
          </div>
        </div>

        {/* Admin user info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(232,87,42,0.07)', borderRadius: 'var(--radius-sm)', margin: '0 0 8px', border: '1px solid rgba(232,87,42,0.15)' }}>
          <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
            alt={user?.username} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--brand-primary)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.username}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 600 }}>Administrator</div>
          </div>
        </div>

        <div className="sidebar-section-title">Navigation</div>
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className={`sidebar-item ${isActive(path) ? 'active' : ''}`}>
            <Icon size={17} /> {label}
            {isActive(path) && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </Link>
        ))}

        <div className="sidebar-section-title" style={{ marginTop: 8 }}>Quick Links</div>
        <Link to="/" className="sidebar-item">
          <Home size={17} /> View Site
        </Link>
        <button className="sidebar-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', color: '#f87171' }}>
          <LogOut size={17} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
