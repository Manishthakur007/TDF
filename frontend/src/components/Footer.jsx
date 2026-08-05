import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🍽️ TheDailyFoodOfficial
            </div>
            <p>Your daily dose of culinary inspiration — from street food to gourmet recipes, healthy bites to indulgent desserts.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/blog" className="footer-link">All Recipes</Link>
            <Link to="/blog?category=street-food" className="footer-link">Street Food</Link>
            <Link to="/blog?category=healthy" className="footer-link">Healthy Eats</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/blog?category=recipes" className="footer-link">🍳 Recipes</Link>
            <Link to="/blog?category=street-food" className="footer-link">🌮 Street Food</Link>
            <Link to="/blog?category=healthy" className="footer-link">🥗 Healthy</Link>
            <Link to="/blog?category=desserts" className="footer-link">🍰 Desserts</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/admin" className="footer-link">Admin Panel</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TheDailyFoodOfficial. All rights reserved.</span>
          <span>Made with ❤️ for food lovers</span>
        </div>
      </div>
    </footer>
  );
}
