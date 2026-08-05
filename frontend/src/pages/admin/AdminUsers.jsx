import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Search, Shield, User, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.getUsers()
      .then(r => setUsers(r.data || []))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const handleToggleRole = async (u) => {
    const action = u.role === 'ADMIN' ? 'demote to User' : 'promote to Admin';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${u.username}"?`)) return;
    try {
      await adminAPI.toggleUserRole(u.id);
      toast.success(`${u.username} ${u.role === 'ADMIN' ? 'demoted to User' : 'promoted to Admin'}`);
      load();
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async (u) => {
    if (u.id === currentUser?.id) { toast.error("You can't delete yourself"); return; }
    if (!window.confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(u.id);
      toast.success(`User "${u.username}" deleted`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete user'); }
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">All registered members of TheDailyFoodOfficial</p>
        </div>
        <button className="btn btn-secondary" onClick={load} title="Refresh">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Members', value: users.length, icon: '👥', color: '#4ecdc4' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, icon: '🛡️', color: '#e8572a' },
          { label: 'Regular Users', value: users.filter(u => u.role === 'USER').length, icon: '👤', color: '#45b7d1' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '20px 24px',
            borderLeft: `3px solid ${s.color}`,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" size={16} />
          <input className="search-input" placeholder="Search users by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: 32 }}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon">👥</div>
            <h3>No users found</h3>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Bio</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`}
                        alt={u.username}
                        style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {u.username}
                          {u.id === currentUser?.id && (
                            <span style={{ marginLeft: 6, fontSize: '0.7rem', background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(52,211,153,0.25)' }}>You</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                  <td>
                    {u.role === 'ADMIN' ? (
                      <span className="status-badge" style={{ background: 'rgba(232,87,42,0.12)', color: 'var(--brand-primary)', border: '1px solid rgba(232,87,42,0.25)' }}>
                        <Shield size={11} /> Admin
                      </span>
                    ) : (
                      <span className="status-badge" style={{ background: 'rgba(69,183,209,0.12)', color: '#45b7d1', border: '1px solid rgba(69,183,209,0.25)' }}>
                        <User size={11} /> User
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: 180 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {u.bio || '—'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {u.createdAt ? formatDistanceToNow(new Date(u.createdAt), { addSuffix: true }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleRole(u)}
                        title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        disabled={u.id === currentUser?.id}
                      >
                        {u.role === 'ADMIN' ? <User size={13} /> : <Shield size={13} />}
                        {u.role === 'ADMIN' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u)}
                        title="Delete user"
                        disabled={u.id === currentUser?.id}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
