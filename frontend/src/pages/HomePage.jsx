import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesAPI, postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { ChevronRight, Flame } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      postsAPI.getAll({ page: 0, size: 7 }),
      categoriesAPI.getAll(),
    ]).then(([postsRes, catsRes]) => {
      const posts = postsRes.data.content || [];
      setFeatured(posts[0] || null);
      setRecent(posts.slice(1, 7));
      setCategories(catsRes.data || []);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setLoading(false));
  }, []);

  const fallback = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop';

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb1" />
        <div className="hero-bg-orb hero-orb2" />
        <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 40 }}>
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="hero-tag">
              <Flame size={13} /> New recipes every day
            </motion.div>
            <motion.h1 variants={fadeUp} className="hero-title">
              Discover the World<br />Through <span>Food</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-subtitle">
              From bustling street corners to cozy kitchens — explore handpicked recipes, street food diaries, and healthy eating guides curated by passionate food lovers.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-actions">
              <Link to="/blog" className="btn btn-primary btn-lg">
                Explore Recipes <ChevronRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join Community
              </Link>
            </motion.div>
          </motion.div>

          {featured && (
            <motion.div 
              className="hero-featured" 
              style={{ flex: 1 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <motion.img
                src={featured.imageUrl || fallback}
                alt={featured.title}
                onError={(e) => { e.target.src = fallback; }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              <div className="hero-featured-overlay">
                <div className="hero-featured-title">{featured.title}</div>
                <div className="hero-featured-meta">
                  <span>✍️ {featured.author?.username}</span>
                  <span>❤️ {featured.likeCount} likes</span>
                  <span>💬 {featured.commentCount} comments</span>
                </div>
                <Link to={`/blog/${featured.slug}`} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  Read Now →
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <motion.div 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
            {[
              { icon: '🍽️', label: 'Recipes', value: '500+' },
              { icon: '👨‍🍳', label: 'Food Authors', value: '50+' },
              { icon: '❤️', label: 'Monthly Readers', value: '100K+' },
              { icon: '🌍', label: 'Countries', value: '30+' },
            ].map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title">Browse by <span>Category</span></h2>
              <p className="section-subtitle">Find exactly what you're craving today</p>
            </motion.div>
          </div>
          <motion.div 
            className="categories-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {loading ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)' }} />
            )) : categories.map(cat => (
              <motion.div 
                key={cat.id} 
                className="cat-card" 
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/blog?category=${cat.slug}`)}
                style={{ borderTop: `4px solid ${cat.color}` }}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-desc">{cat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Recent Posts ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title">Latest <span>Posts</span></h2>
              <p className="section-subtitle">Fresh food stories from our community</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Link to="/blog" className="btn btn-secondary">
                View All <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
          {loading ? (
            <div className="posts-grid">
              {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}
            </div>
          ) : recent.length > 0 ? (
            <motion.div 
              className="posts-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {recent.map(post => (
                <motion.div key={post.id} variants={fadeUp}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <h3>No posts yet</h3>
              <p>Check back soon for delicious content!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,191,36,0.08))',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 'var(--radius-xl)', padding: '60px 48px',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', filter: 'blur(50px)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginBottom: 16 }}>
              Ready to share your <span style={{ color: 'var(--brand-primary)' }}>food story</span>?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 32px' }}>
              Join thousands of food enthusiasts and start sharing your culinary adventures today. Let's make the internet delicious.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
                Get Started Free 🚀
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
