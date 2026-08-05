import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const res = await register(form.username, form.email, form.password);
    if (res.success) {
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍽️ TheDailyFoodOfficial</div>
        <div className="auth-tagline">Join thousands of food lovers</div>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Free forever. Like, comment, and connect.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" className="form-input" placeholder="foodlover42"
              value={form.username} onChange={handle} required minLength={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} className="form-input"
                placeholder="Min. 6 characters" value={form.password} onChange={handle} required
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Free Account 🚀'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
