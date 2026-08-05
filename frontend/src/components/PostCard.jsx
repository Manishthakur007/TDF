import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Eye } from 'lucide-react';

export default function PostCard({ post }) {
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  const fallbackImg = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop`;

  return (
    <Link to={`/blog/${post.slug}`} className="card post-card">
      <div className="post-card-img-wrap">
        <img
          src={post.imageUrl || fallbackImg}
          alt={post.title}
          className="post-card-img"
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        <div className="post-card-category-badge">
          <span>{post.category?.icon}</span>
          <span>{post.category?.name}</span>
        </div>
      </div>
      <div className="post-card-body">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-meta">
          <div className="post-card-author">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`}
              alt={post.author?.username}
              className="post-card-avatar"
            />
            <span className="post-card-author-name">{post.author?.username}</span>
          </div>
          <div className="post-card-stats">
            <span className="post-card-stat"><Heart size={12} /> {post.likeCount}</span>
            <span className="post-card-stat"><MessageCircle size={12} /> {post.commentCount}</span>
            <span className="post-card-stat"><Eye size={12} /> {post.views}</span>
          </div>
        </div>
        <div className="post-card-date">{timeAgo}</div>
      </div>
    </Link>
  );
}
