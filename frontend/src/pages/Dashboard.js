import React, { useState, useEffect } from 'react';
import { getMoodStats, getAssessmentHistory, getSessions } from '../api';

const MOODS = [
  { emoji: '😌', label: 'Calm',    value: 8 },
  { emoji: '😊', label: 'Good',    value: 9 },
  { emoji: '😐', label: 'Neutral', value: 5 },
  { emoji: '😔', label: 'Low',     value: 3 },
  { emoji: '😰', label: 'Anxious', value: 2 },
];

const WEEK_MOODS = [5, 6, 7, 5, 8, 7, 7];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TIPS = [
  'Take 5 deep breaths when you feel overwhelmed.',
  'A 20-minute walk can significantly improve your mood.',
  'Journaling for 10 minutes a day reduces anxiety.',
  'You don\'t have to be okay all the time — asking for help is strength.',
  'Sleep is the most powerful mental health tool you have.',
];

export default function Dashboard({ user, onNavigate }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [stats, setStats] = useState(null);
  const [lastAssessment, setLastAssessment] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    getMoodStats().then(r => setStats(r.data)).catch(() => {});
    getAssessmentHistory().then(r => setLastAssessment((r.data || [])[0])).catch(() => {});
    getSessions().then(r => setSessions(r.data || [])).catch(() => {});
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTimeout(() => setMoodSaved(true), 400);
  };

  const avgMood = stats?.avg_mood ? parseFloat(stats.avg_mood).toFixed(1) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xl)', maxWidth: 1100 }}>

      {/* ── Check-in Card ── */}
      <div className="animate-fadeInUp" style={{
        position: 'relative', background: 'var(--forest)',
        borderRadius: 'var(--r-xl)', padding: '28px 36px',
        overflow: 'hidden', minHeight: 180, display: 'flex', alignItems: 'center',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -60, top: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(74,140,122,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(74,140,122,0.10)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {moodSaved ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--white)', marginBottom: 6 }}>
                Logged! Take care of yourself today 🌿
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                Feeling <strong style={{ color: 'var(--sage-light)' }}>{selectedMood?.label}</strong> — we've noted your mood.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--white)', marginBottom: 6 }}>
                How are you feeling right now?
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                Daily check-in · takes just a moment · always private
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {MOODS.map(m => (
                  <button key={m.label} onClick={() => handleMoodSelect(m)} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px', borderRadius: 'var(--r-full)',
                    background: selectedMood?.label === m.label ? 'var(--sage)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${selectedMood?.label === m.label ? 'var(--sage)' : 'rgba(255,255,255,0.18)'}`,
                    color: 'rgba(255,255,255,0.85)', fontSize: 13.5,
                    transition: 'all 0.15s', cursor: 'pointer',
                    transform: selectedMood?.label === m.label ? 'translateY(-2px)' : 'none',
                  }}>
                    <span style={{ fontSize: 17 }}>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="animate-fadeInUp delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap-md)' }}>
        {/* Avg mood */}
        <div className="card" style={{ padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Avg mood</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1 }}>
              {avgMood}<small style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)' }}>/10</small>
            </div>
            <div style={{ fontSize: 12, color: 'var(--sage)', marginTop: 4 }}>↑ Up this week</div>
          </div>
          {/* Sparkline */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 36 }}>
            {WEEK_MOODS.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(m/10)*100}%`, background: 'var(--sage-pale)', borderRadius: '2px 2px 0 0', minHeight: 3, transition: 'background 0.15s' }} />
                <span style={{ fontSize: 9, color: 'var(--text-ghost)' }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat sessions */}
        <div className="card" style={{ padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Chat sessions</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1 }}>{sessions.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total conversations</div>
          </div>
        </div>

        {/* Stress */}
        <div className="card" style={{ padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 20 }}>😰</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Avg stress</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1 }}>
              {stats?.avg_stress ? parseFloat(stats.avg_stress).toFixed(1) : '—'}<small style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)' }}>/5</small>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>This period</div>
          </div>
        </div>

        {/* Assessment */}
        <div className="card" style={{ padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>Last risk level</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.2, marginTop: 6 }}>
              {lastAssessment ? lastAssessment.risk_level.charAt(0).toUpperCase() + lastAssessment.risk_level.slice(1) : 'None yet'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{lastAssessment?.assessment_type?.toUpperCase() || 'Take one now'}</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="animate-fadeInUp delay-2" style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Talk to AI', icon: '✦', page: 'chat', color: 'var(--sage)' },
          { label: 'Log Mood', icon: '◈', page: 'mood', color: 'var(--warm)' },
          { label: 'Assessment', icon: '❋', page: 'assessment', color: 'var(--lavender)' },
          { label: 'Settings', icon: '⊙', page: 'settings', color: 'var(--forest-light)' },
        ].map(a => (
          <button key={a.page} onClick={() => onNavigate(a.page)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '14px 12px', borderRadius: 'var(--r-lg)',
            fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            background: a.color, color: 'var(--white)', border: 'none',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <span style={{ fontSize: 15 }}>{a.icon}</span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tip + Crisis ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-md)' }}>
        {/* Daily tip */}
        <div className="card animate-fadeInUp delay-3" style={{ padding: 'var(--gap-lg)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Today's wellness tip</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</p>
          </div>
        </div>

        {/* Crisis */}
        <div className="animate-fadeInUp delay-4" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 'var(--gap-md) var(--gap-lg)',
          background: '#fff5f5', border: '1px solid #ffd4d4',
          borderRadius: 'var(--r-lg)', borderLeft: '4px solid #e55',
        }}>
          <span style={{ fontSize: 22 }}>🆘</span>
          <div>
            <strong style={{ fontSize: 13, color: '#c33', display: 'block' }}>Need immediate support?</strong>
            <span style={{ fontSize: 12, color: '#a66' }}>iCall: 9152987821 · Vandrevala: 1860-2662-345</span>
          </div>
        </div>
      </div>
    </div>
  );
}
