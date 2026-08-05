import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react';

const EMPTY_FORM = { name: '', slug: '', description: '', icon: '🍽️', color: '#e8572a' };
const PRESET_ICONS = ['🍽️','🌮','🍳','🥗','🍰','🍜','🥩','🍕','🥪','🍛','🍣','🥘','🍝','🫕','🧆'];
const PRESET_COLORS = ['#e8572a','#4ecdc4','#f4a94e','#45b7d1','#f06292','#ab47bc','#34d399','#fbbf24','#f87171','#60a5fa'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getCategories()
      .then(r => setCategories(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setModal('create'); };
  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '🍽️', color: cat.color || '#e8572a' });
    setEditing(cat);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY_FORM); };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
      ...(name === 'name' && !editing ? { slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') } : {})
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) { toast.error('Name and slug are required'); return; }
    setSaving(true);
    try {
      if (modal === 'edit') {
        await adminAPI.updateCategory(editing.id, form);
        toast.success('Category updated!');
      } else {
        await adminAPI.createCategory(form);
        toast.success('Category created!');
      }
      closeModal(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Posts in this category may be affected.`)) return;
    try {
      await adminAPI.deleteCategory(cat.id);
      toast.success(`"${cat.name}" deleted`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete category'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage blog categories and their icons</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Grid of category cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Tag size={48} /></div>
          <h3>No categories yet</h3>
          <p>Create your first category to organize posts</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat.id} className="card" style={{ borderTop: `3px solid ${cat.color}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: '2.4rem' }}>{cat.icon}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(cat)} title="Edit">
                    <Pencil size={13} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{cat.description || '—'}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>/{cat.slug}</span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? '🏷️ New Category' : '✏️ Edit Category'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input name="name" className="form-input" placeholder="e.g. Street Food"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug *</label>
                    <input name="slug" className="form-input" placeholder="e.g. street-food"
                      value={form.slug} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input name="description" className="form-input" placeholder="Short description of this category"
                    value={form.description} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {PRESET_ICONS.map(ic => (
                      <button key={ic} type="button"
                        onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        style={{
                          width: 40, height: 40, borderRadius: 8, fontSize: '1.4rem',
                          border: form.icon === ic ? '2px solid var(--brand-primary)' : '1px solid var(--border)',
                          background: form.icon === ic ? 'rgba(232,87,42,0.1)' : 'var(--bg-card)',
                          cursor: 'pointer', transition: 'var(--transition)'
                        }}>{ic}</button>
                    ))}
                  </div>
                  <input name="icon" className="form-input" placeholder="Or type any emoji"
                    value={form.icon} onChange={handleChange} style={{ width: 120 }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {PRESET_COLORS.map(col => (
                      <button key={col} type="button"
                        onClick={() => setForm(f => ({ ...f, color: col }))}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', background: col,
                          border: form.color === col ? '3px solid white' : '2px solid transparent',
                          outline: form.color === col ? `2px solid ${col}` : 'none',
                          cursor: 'pointer', transition: 'var(--transition)'
                        }} />
                    ))}
                  </div>
                  <input name="color" className="form-input" placeholder="#e8572a"
                    value={form.color} onChange={handleChange} style={{ width: 140 }} />
                </div>

                {/* Preview */}
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--bg-card)', border: `1px solid var(--border)`, borderTop: `3px solid ${form.color}`, borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{form.icon}</span>
                    <span style={{ fontWeight: 700 }}>{form.name || 'Category Name'}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : modal === 'create' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
