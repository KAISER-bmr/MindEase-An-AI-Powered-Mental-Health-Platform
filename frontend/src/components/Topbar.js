import React, { useState } from 'react';

const PAGE_LABELS = {
  dashboard:  'Dashboard',
  chat:       'AI Support',
  mood:       'Mood Tracker',
  assessment: 'Self-Assessment',
  settings:   'Settings',
};

export default function Topbar({ activePage, user, onMenuToggle, onNavigate }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const NOTIFS = [
    { id: 1, text: 'Daily check-in reminder — how are you today?', time: 'now', unread: true },
    { id: 2, text: 'New: PHQ-9 assessment available', time: '2h ago', unread: true },
    { id: 3, text: 'Your mood trend is improving this week 🌿', time: '1d ago', unread: false },
  ];
  const unread = NOTIFS.filter(n => n.unread).length;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 'var(--topbar-height)', background: 'var(--white)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 var(--gap-xl)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuToggle} style={{
          display: 'flex', flexDirection: 'column', gap: 5,
          padding: '6px 7px', borderRadius: 'var(--r-sm)',
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display: 'block', width: 18, height: 2, background: 'var(--text-secondary)', borderRadius: 1 }} />
          ))}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {greeting}, {user.name.split(' ')[0]}
          </span>
          <span style={{ color: 'var(--text-ghost)' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>{PAGE_LABELS[activePage]}</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="badge badge-warm" style={{ cursor: 'default' }}>
          🔥 {user.streak}-day streak
        </div>

        {/* Notif bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(o => !o)} style={{
            width: 38, height: 38, borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'background 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--warm)', color: 'white',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--white)',
              }}>{unread}</span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 300,
              background: 'var(--white)', border: '1px solid var(--border-light)',
              borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
              animation: 'fadeInUp 0.2s ease', zIndex: 200,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Notifications</span>
                <button onClick={() => setNotifOpen(false)} style={{ fontSize: 12, color: 'var(--sage)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
              </div>
              {NOTIFS.map(n => (
                <div key={n.id} style={{
                  display: 'flex', gap: 10, padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: n.unread ? 'rgba(74,140,122,0.04)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sage)', flexShrink: 0, marginTop: 5, opacity: n.unread ? 1 : 0 }} />
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>{n.text}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="avatar avatar-sm avatar-sage" style={{ cursor: 'pointer' }}>{user.initials}</div>
      </div>
    </header>
  );
}
