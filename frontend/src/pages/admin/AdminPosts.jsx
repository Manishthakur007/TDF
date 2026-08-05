import { useState, useEffect, useCallback } from 'react';
import { adminAPI, categoriesAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Search } from 'lucide-react';

const EMPTY_FORM = {
  title: '', content: '', excerpt: '', imageUrl: '',
  categoryId: '', status: 'PUBLISHED',
};

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getPosts({ page, size: 10 })
      .then(r => { setPosts(r.data.content || []); setTotalPages(r.data.totalPages || 1); })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoriesAPI.getAll().then(r => setCategories(r.data)); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setModal('create'); };
  const openEdit = (post) => {
    setForm({
      title: post.title, content: post.content, excerpt: post.excerpt || '',
      imageUrl: post.imageUrl || '', categoryId: post.category?.id || '',
      status: post.status,
    });
    setEditing(post);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY_FORM); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.categoryId) {
      toast.error('Title, content and category are required'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, categoryId: Number(form.categoryId) };
      if (modal === 'edit') {
        await adminAPI.updatePost(editing.id, payload);
        toast.success('Post updated!');
      } else {
        await adminAPI.createPost(payload);
        toast.success('Post created!');
      }
      closeModal(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deletePost(id);
      toast.success('Post deleted');
      load();
    } catch { toast.error('Failed to delete post'); }
  };

  const toggle = async (post) => {
    try {
      await adminAPI.updatePost(post.id, { status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' });
      toast.success(`Post ${post.status === 'PUBLISHED' ? 'unpublished' : 'published'}`);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const fallback = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120';

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Posts</h1>
          <p className="admin-page-subtitle">Manage all blog posts and articles</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" size={16} />
          <input className="search-input" placeholder="Search posts..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: 32 }}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, marginBottom: 12, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon">📝</div>
            <h3>No posts found</h3>
            <p>Create your first post to get started</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={post.imageUrl || fallback}
                        alt={post.title}
                        className="admin-table-img"
                        onError={e => { e.target.src = fallback; }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 220,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          by {post.author?.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.825rem' }}>
                      {post.category?.icon} {post.category?.name}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status === 'PUBLISHED' ? 'status-published' : 'status-draft'}`}>
                      {post.status === 'PUBLISHED' ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{post.views?.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{post.likeCount}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggle(post)}
                        title={post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                        {post.status === 'PUBLISHED' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(post)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id, post.title)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`pagination-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>
              {i + 1}
            </button>
          ))}
          <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? '✍️ Create New Post' : '✏️ Edit Post'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input name="title" className="form-input" placeholder="Enter post title..."
                    value={form.title} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange} required>
                      <option value="">Select category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input name="imageUrl" className="form-input" placeholder="https://images.unsplash.com/..."
                    value={form.imageUrl} onChange={handleChange} />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="preview"
                      style={{ marginTop: 8, height: 80, borderRadius: 8, objectFit: 'cover', width: '100%' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Excerpt (short description)</label>
                  <textarea name="excerpt" className="form-textarea" rows={2}
                    placeholder="Brief summary shown in post cards..."
                    value={form.excerpt} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Content * (HTML supported)</label>
                  <textarea name="content" className="form-textarea" rows={8}
                    placeholder="&lt;p&gt;Write your post content here...&lt;/p&gt;"
                    value={form.content} onChange={handleChange} required
                    style={{ minHeight: 180, fontFamily: 'monospace', fontSize: '0.83rem' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : modal === 'create' ? 'Create Post' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
