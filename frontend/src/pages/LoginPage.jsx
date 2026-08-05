import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back! 🎉');
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍽️ TheDailyFoodOfficial</div>
        <div className="auth-tagline">Your daily culinary adventure starts here</div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to like posts and join the conversation</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} className="form-input"
                placeholder="Your password" value={form.password} onChange={handle} required
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div style={{ background: 'rgba(232,87,42,0.08)', border: '1px solid rgba(232,87,42,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--brand-primary)' }}>Demo Admin:</strong> admin@foodblog.com / admin123
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
