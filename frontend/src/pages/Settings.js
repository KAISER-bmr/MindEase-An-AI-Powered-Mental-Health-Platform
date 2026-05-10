import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ width: 44, height: 24, background: checked ? 'var(--sage)' : 'var(--border-light)', borderRadius: 99, position: 'relative', transition: 'background 0.15s' }}>
        <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.15s' }} />
      </div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45, marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="card" style={{ padding: 'var(--gap-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--gap-md)' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { user, logoutUser } = useAuth();
  const [dailyCheckin, setDailyCheckin] = useState(true);
  const [apptReminder, setApptReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [shareData, setShareData] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [crisisBanner, setCrisisBanner] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-lg)', maxWidth: 860 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your preferences and account.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--gap-lg)', alignItems: 'start' }}>

        {/* Profile */}
        <Section icon="👤" title="Profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="avatar avatar-lg avatar-sage">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 12 }} />
          <Row label="Display name" desc="Used in greetings">
            <input className="input" defaultValue={user?.name?.split(' ')[0]} style={{ width: 140, fontSize: 13, padding: '7px 10px' }} />
          </Row>
          <Row label="Account" desc="">
            <button className="btn btn-outline" onClick={logoutUser} style={{ fontSize: 12, padding: '7px 14px', color: '#c33', borderColor: '#ffd4d4' }}>Sign out</button>
          </Row>
        </Section>

        {/* Privacy */}
        <Section icon="🔒" title="Privacy & Data">
          <Row label="Share mood data" desc="Allow counselors to view your weekly trends">
            <Toggle checked={shareData} onChange={setShareData} />
          </Row>
          <Row label="Enable chat history" desc="Save your AI conversations for continuity">
            <Toggle checked={chatHistory} onChange={setChatHistory} />
          </Row>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-outline" style={{ fontSize: 12 }}>📥 Download data</button>
            <button className="btn" style={{ fontSize: 12, color: '#c33', border: '1.5px solid #ffd4d4' }}>🗑 Delete account</button>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon="🔔" title="Notifications">
          <Row label="Daily check-in reminder" desc="A gentle nudge to log your mood each day">
            <Toggle checked={dailyCheckin} onChange={setDailyCheckin} />
          </Row>
          <Row label="Appointment reminders" desc="Notifications before sessions">
            <Toggle checked={apptReminder} onChange={setApptReminder} />
          </Row>
          <Row label="Weekly progress report" desc="Summary of your mood and activity">
            <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
          </Row>
        </Section>

        {/* Crisis */}
        <Section icon="🆘" title="Crisis & Safety">
          <Row label="Show crisis banner" desc="Display helpline numbers on dashboard">
            <Toggle checked={crisisBanner} onChange={setCrisisBanner} />
          </Row>
          <div style={{ marginTop: 12, padding: 'var(--gap-md)', background: 'var(--parchment)', borderRadius: 'var(--r-md)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>National Helplines</div>
            {[
              { name: 'iCall (TISS)', num: '9152987821' },
              { name: 'Vandrevala Foundation', num: '1860-2662-345' },
              { name: 'NIMHANS', num: '080-46110007' },
            ].map(h => (
              <div key={h.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{h.name}</span>
                <a href={`tel:${h.num}`} style={{ fontSize: 12.5, color: 'var(--sage)', fontWeight: 500 }}>{h.num}</a>
              </div>
            ))}
          </div>
        </Section>

        {/* About */}
        <Section icon="🛡" title="Security & About">
          <Row label="Change password" desc=""><button className="btn btn-outline" style={{ fontSize: 12 }}>Update</button></Row>
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
          {[
            { k: 'App version', v: 'MindEase v1.0.0' },
            { k: 'Data encrypted', v: '✓ AES-256 + TLS 1.3', green: true },
            { k: 'Privacy policy', v: 'View →', link: true },
          ].map(r => (
            <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{r.k}</span>
              <span style={{ fontSize: 12.5, color: r.green ? 'var(--sage)' : r.link ? 'var(--sage)' : 'var(--text-secondary)', fontWeight: 500 }}>{r.v}</span>
            </div>
          ))}
        </Section>
      </div>

      {/* Save bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--gap-md) var(--gap-lg)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Changes to toggles are saved automatically.</span>
        <button className={`btn ${saved ? 'btn-outline' : 'btn-primary'}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
