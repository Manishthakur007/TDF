import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { Search, Filter } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '0');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    postsAPI.getAll({ page, size: 9, category: category || undefined, search: search || undefined })
      .then(r => {
        setPosts(r.data.content || []);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(err => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(160deg, rgba(232,87,42,0.06) 0%, transparent 60%)', padding: '60px 0 0', borderBottom: '1px solid var(--border)' }}>
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, marginBottom: 8 }}>
            🍳 The Food <span style={{ color: 'var(--brand-primary)' }}>Blog</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1rem' }}>
            Discover recipes, street food diaries, and healthy eating tips
          </p>

          {/* Search */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <div className="search-wrap" style={{ flex: 1, minWidth: 260 }}>
              <Search className="search-icon" size={16} />
              <input
                className="search-input"
                placeholder="Search recipes, dishes..."
                value={search}
                onChange={e => setParam('search', e.target.value)}
              />
            </div>
          </div>

          {/* Category filter chips */}
          <div className="categories-row" style={{ paddingBottom: 0 }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-chip ${!category ? 'active' : ''}`} 
              onClick={() => setParam('category', '')}
            >
              🍽️ All
            </motion.button>
            {categories.map(cat => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                className={`category-chip ${category === cat.slug ? 'active' : ''}`}
                onClick={() => setParam('category', cat.slug)}
              >
                {cat.icon} {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="posts-grid">
            {Array(9).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {search && <><strong style={{ color: 'var(--text-primary)' }}>"{search}"</strong> · </>}
                Page {page + 1} of {totalPages}
              </p>
              {category && (
                <button className="btn btn-ghost btn-sm" onClick={() => setParam('category', '')}>
                  Clear filter ✕
                </button>
              )}
            </div>
            <motion.div 
              className="posts-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {posts.map(post => (
                <motion.div 
                  key={post.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" onClick={() => setPage(page - 1)} disabled={page === 0}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} className={`pagination-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>
                    {i + 1}
                  </button>
                ))}
                <button className="pagination-btn" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>›</button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No posts found</h3>
            <p>{search ? `No results for "${search}"` : 'No posts in this category yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
