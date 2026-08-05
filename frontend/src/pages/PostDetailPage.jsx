import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Eye, ArrowLeft, Send, Trash2, Clock } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function PostDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    postsAPI.getBySlug(slug)
      .then(r => {
        setPost(r.data);
        setLiked(r.data.likedByCurrentUser);
        setLikeCount(r.data.likeCount);
        return commentsAPI.getByPost(r.data.id);
      })
      .then(r => setComments(r.data))
      .catch(() => navigate('/blog'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleLike = async () => {
    if (!user) { toast.error('Sign in to like posts'); return; }
    try {
      const { data } = await postsAPI.toggleLike(post.id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      toast.success(data.liked ? '❤️ Liked!' : 'Unliked');
    } catch { toast.error('Something went wrong'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to comment'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await commentsAPI.create(post.id, { content: commentText });
      setComments(prev => [data, ...prev]);
      setCommentText('');
      toast.success('Comment posted!');
    } catch { toast.error('Failed to post comment'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  const fallback = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop';

  if (loading) return (
    <div className="page-wrapper">
      <div className="loader-wrap"><div className="spinner" /></div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="page-wrapper">
      {/* Hero Image */}
      <div className="post-hero">
        <img src={post.imageUrl || fallback} alt={post.title} className="post-hero-img"
          onError={e => { e.target.src = fallback; }} />
        <div className="post-hero-overlay" />
      </div>

      <div className="post-detail-wrap">
        {/* Back */}
        <Link to="/blog" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Header */}
        <div className="post-detail-header">
          <div className="post-detail-category">
            {post.category?.icon} {post.category?.name}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <div className="post-detail-author">
              <img
                src={post.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`}
                alt={post.author?.username}
              />
              <div className="post-detail-author-info">
                <strong>{post.author?.username}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Author</span>
              </div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={14} />
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Eye size={14} /> {post.views} views
            </span>
          </div>
        </div>

        <div className="divider" />

        {/* Body */}
        <div className="post-detail-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

        {/* Like / Share actions */}
        <div className="post-actions">
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <span className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
            <MessageCircle size={16} /> {comments.length} Comments
          </span>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h2 className="comments-title">💬 Comments ({comments.length})</h2>

          {/* Comment form */}
          <form className="comment-form" onSubmit={handleComment}>
            {user ? (
              <>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                    alt={user.username}
                    className="comment-avatar"
                  />
                  <textarea
                    className="form-textarea"
                    placeholder="Share your thoughts about this recipe..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                    style={{ flex: 1, minHeight: 80 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting || !commentText.trim()}>
                    <Send size={15} /> {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Sign in</Link>{' '}
                to join the conversation
              </div>
            )}
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="no-comments">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div>
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <img
                    src={c.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.username}`}
                    alt={c.user?.username}
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{c.user?.username}</span>
                      <span className="comment-date">
                        {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ''}
                      </span>
                      {user && (user.id === c.user?.id || user.role === 'ADMIN') && (
                        <button className="comment-delete" onClick={() => handleDeleteComment(c.id)}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
