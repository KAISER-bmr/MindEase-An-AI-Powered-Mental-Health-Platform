import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser({ id: res.data.user_id, name: res.data.name, email: form.email }, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center',
      background: 'linear-gradient(180deg, var(--forest) 0%, var(--forest-light) 100%)',
      padding: 20,
    }}>
      <div style={{
        width: 'min(460px, 100%)', borderRadius: 20, background: 'var(--white)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 36,
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <span style={{ fontSize: 28 }}>◉</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--forest)' }}>
            Mind<span style={{ color: 'var(--sage)' }}>Ease</span>
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6, color: 'var(--text-primary)' }}>Welcome back</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Sign in to continue your journey</p>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #ffd4d4', color: '#c33', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
            <input name="email" type="email" required value={form.email} onChange={handle}
              className="input" placeholder="you@college.edu" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
            <input name="password" type="password" required value={form.password} onChange={handle}
              className="input" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          New here? <Link to="/register" style={{ color: 'var(--sage)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
