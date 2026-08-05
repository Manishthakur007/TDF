import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FileText, Users, Heart, MessageCircle, BookOpen, TrendingUp, Eye, Tag } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Posts', value: stats.totalPosts, icon: '📝', color: '#e8572a', sub: `${stats.publishedPosts} published` },
    { label: 'Draft Posts', value: stats.draftPosts, icon: '📋', color: '#f4a94e', sub: 'Awaiting publish' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#4ecdc4', sub: 'Registered members' },
    { label: 'Comments', value: stats.totalComments, icon: '💬', color: '#45b7d1', sub: 'All time' },
    { label: 'Total Likes', value: stats.totalLikes, icon: '❤️', color: '#f06292', sub: 'Post engagements' },
    { label: 'Categories', value: stats.totalCategories, icon: '🏷️', color: '#ab47bc', sub: 'Active categories' },
  ] : [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening on your blog.</p>
        </div>
        <Link to="/admin/posts" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="stat-cards-grid">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : (
        <div className="stat-cards-grid">
          {statCards.map(s => (
            <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-icon">{s.icon}</div>
              </div>
              <div className="stat-card-value" style={{ color: s.color }}>{s.value ?? 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: '📝 Create New Post', to: '/admin/posts', desc: 'Write and publish a new article' },
              { label: '👥 Manage Users', to: '/admin/users', desc: 'View all registered members' },
              { label: '🌐 View Live Site', to: '/', desc: 'See how the blog looks publicly' },
              { label: '📖 Browse Blog', to: '/blog', desc: 'Read published posts' },
            ].map(a => (
              <Link key={a.to} to={a.to}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.desc}</div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>
            📊 Blog Overview
          </h3>
          {stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Publish Rate', value: stats.totalPosts ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0, suffix: '%', color: '#34d399' },
                { label: 'Engagement (Likes)', value: stats.totalLikes, suffix: '', color: '#f06292' },
                { label: 'Community (Comments)', value: stats.totalComments, suffix: '', color: '#45b7d1' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: m.color }}>{m.value}{m.suffix}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, background: m.color,
                      width: m.suffix === '%' ? `${m.value}%` : `${Math.min(100, (m.value / 100) * 100)}%`,
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: '14px 16px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>✨ Blog is Active</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {stats.publishedPosts} posts live · {stats.totalUsers} members
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
