import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      loginUser({ id: res.data.user_id, name: res.data.name, email: form.email }, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <span style={{ fontSize: 28 }}>◉</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--forest)' }}>
            Mind<span style={{ color: 'var(--sage)' }}>Ease</span>
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6, color: 'var(--text-primary)' }}>Create your account</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>It only takes a minute</p>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #ffd4d4', color: '#c33', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name:'name',     type:'text',     label:'Full Name',       placeholder:'Your name' },
            { name:'email',    type:'email',    label:'College Email',    placeholder:'you@college.edu' },
            { name:'password', type:'password', label:'Password',         placeholder:'At least 6 characters' },
            { name:'confirm',  type:'password', label:'Confirm Password', placeholder:'Repeat your password' },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input name={f.name} type={f.type} required value={form[f.name]} onChange={handle}
                className="input" placeholder={f.placeholder} />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--sage)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
