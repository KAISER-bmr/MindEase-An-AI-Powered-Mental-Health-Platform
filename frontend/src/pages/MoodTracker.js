import React, { useState, useEffect } from 'react';
import { logMood, getMoodHistory, getMoodStats } from '../api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const MOODS = [
  { score:1, emoji:'😭', label:'Terrible' }, { score:2, emoji:'😞', label:'Very Bad' },
  { score:3, emoji:'😟', label:'Bad' },       { score:4, emoji:'😕', label:'Not Great' },
  { score:5, emoji:'😐', label:'Okay' },      { score:6, emoji:'🙂', label:'Decent' },
  { score:7, emoji:'😊', label:'Good' },       { score:8, emoji:'😄', label:'Great' },
  { score:9, emoji:'😁', label:'Excellent' }, { score:10, emoji:'🤩', label:'Amazing' },
];

function Slider({ label, value, min, max, step=1, onChange, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color }} />
    </div>
  );
}

export default function MoodTracker() {
  const [form, setForm] = useState({ mood_score:5, stress_level:3, anxiety_level:3, sleep_hours:7, notes:'' });
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    getMoodHistory(14).then(r => setHistory(r.data || [])).catch(() => {});
    getMoodStats().then(r => setStats(r.data || null)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logMood(form);
      setSuccess(true);
      load();
      setTimeout(() => setSuccess(false), 3000);
    } catch {} finally { setLoading(false); }
  };

  const chartData = [...history].reverse().map(h => ({
    date: format(new Date(h.logged_at), 'MMM d'),
    mood: h.mood_score, stress: h.stress_level, anxiety: h.anxiety_level,
  }));

  const sel = MOODS.find(m => m.score === form.mood_score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xl)', maxWidth: 1000 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)' }}>Mood Tracker</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Log how you're feeling to spot patterns and understand yourself better.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--gap-lg)', alignItems: 'start' }}>

        {/* Log form */}
        <div className="card" style={{ padding: 'var(--gap-lg)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 20 }}>How are you feeling?</h2>

          {success && (
            <div style={{ background: '#f0faf5', border: '1px solid #a8dfc5', borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--forest-light)' }}>
              ✅ Mood logged successfully!
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Emoji display */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 52 }}>{sel?.emoji}</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{sel?.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{form.mood_score}/10</div>
            </div>
            <input type="range" min="1" max="10" value={form.mood_score}
              onChange={e => setForm(f => ({ ...f, mood_score: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--sage)', marginBottom: 6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              <span>Terrible</span><span>Amazing</span>
            </div>

            <Slider label="😰 Stress Level" value={form.stress_level} min={1} max={5} onChange={v => setForm(f=>({...f,stress_level:v}))} color="var(--warm)" />
            <Slider label="😟 Anxiety Level" value={form.anxiety_level} min={1} max={5} onChange={v => setForm(f=>({...f,anxiety_level:v}))} color="#8b7eb8" />
            <Slider label="💤 Sleep Hours" value={form.sleep_hours} min={0} max={12} step={0.5} onChange={v => setForm(f=>({...f,sleep_hours:v}))} color="var(--sage)" />

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                className="input" rows={3} placeholder="What's influencing your mood today?"
                style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Saving…' : '📊 Log My Mood'}
            </button>
          </form>
        </div>

        {/* Stats + Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Avg Mood', val: parseFloat(stats.avg_mood||0).toFixed(1), max: '/10', color: 'var(--sage)' },
                { label: 'Avg Stress', val: parseFloat(stats.avg_stress||0).toFixed(1), max: '/5', color: 'var(--warm)' },
                { label: 'Avg Sleep', val: parseFloat(stats.avg_sleep||0).toFixed(1), max: 'hrs', color: 'var(--sage)' },
                { label: 'Entries', val: stats.total_logs||0, max: '', color: '#8b7eb8' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center', padding: 16, background: 'var(--parchment)', border: 'none' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: s.color }}>
                    {s.val}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.max}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {chartData.length > 1 && (
            <div className="card" style={{ padding: 'var(--gap-lg)' }}>
              <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-primary)' }}>Mood Over Time</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a8c7a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4a8c7a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b8c7a' }} />
                  <YAxis domain={[0,10]} tick={{ fontSize: 11, fill: '#6b8c7a' }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8f0ec', fontSize: 12 }} />
                  <Area type="monotone" dataKey="mood" stroke="#4a8c7a" strokeWidth={2} fill="url(#mg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartData.length > 1 && (
            <div className="card" style={{ padding: 'var(--gap-lg)' }}>
              <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-primary)' }}>Stress & Anxiety</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b8c7a' }} />
                  <YAxis domain={[0,5]} tick={{ fontSize: 11, fill: '#6b8c7a' }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8f0ec', fontSize: 12 }} />
                  <Line type="monotone" dataKey="stress" stroke="#c97d4a" strokeWidth={2} dot={false} name="Stress" />
                  <Line type="monotone" dataKey="anxiety" stroke="#8b7eb8" strokeWidth={2} dot={false} name="Anxiety" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card" style={{ padding: 'var(--gap-lg)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16 }}>Recent Entries</h2>
          {history.slice(0,7).map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{MOODS.find(m=>m.score===h.mood_score)?.emoji||'😐'}</span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {format(new Date(h.logged_at), 'MMM d, yyyy · h:mm a')}
                  </div>
                  {h.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.notes}</div>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--sage)' }}>{h.mood_score}/10</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.mood_label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
