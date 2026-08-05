import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  // eslint-disable-next-line
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const handleLogout = () => { logout(); navigate('/'); setUserMenuOpen(false); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="container">
          {/* Logo */}
          <Link to="/" className="nav-logo">🍽️ TheDailyFoodOfficial</Link>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: 'flex' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>{label}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop actions */}
          <div className="nav-actions" style={{ display: 'flex' }}>
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  className="nav-user-btn"
                  onClick={() => setUserMenuOpen(o => !o)}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                    alt={user.username}
                    className="nav-avatar"
                  />
                  <span className="nav-user-name">{user.username}</span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 180,
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)', padding: 8, zIndex: 1001,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        transformOrigin: 'top right'
                      }}
                    >
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{user.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <LayoutDashboard size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, fontSize: '0.875rem', color: '#f87171', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', transition: 'var(--transition)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setMobileOpen(o => !o)}
              style={{ display: 'none', padding: 8 }}
              id="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 999,
          background: 'rgba(13,13,15,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)', padding: '16px 24px 24px',
          animation: 'slideUp 0.2s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
                style={{ padding: '12px 16px', fontSize: '1rem' }}>
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                style={{ padding: '12px 16px', fontSize: '1rem' }}>
                Admin Panel
              </Link>
            )}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
              {user ? (
                <>
                  <div style={{ padding: '8px 16px', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{user.username}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                  <Link to="/login" className="btn btn-secondary" style={{ justifyContent: 'center' }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }}>Join Free</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-actions > *:not(#mobile-menu-btn) { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
