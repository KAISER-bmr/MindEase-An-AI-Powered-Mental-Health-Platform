import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '◎', group: 'main' },
  { id: 'chat',       label: 'AI Support', icon: '✦', group: 'main' },
  { id: 'mood',       label: 'Mood Tracker',icon: '◈', group: 'main' },
  { id: 'assessment', label: 'Assessment',  icon: '❋', group: 'main' },
  { id: 'settings',   label: 'Settings',   icon: '⊙', group: 'bottom' },
];

const styles = {
  sidebar: (open) => ({
    position: 'fixed', top: 0, left: 0, height: '100vh',
    background: 'var(--forest)', display: 'flex', flexDirection: 'column',
    padding: '16px 10px', transition: 'width 0.25s ease',
    zIndex: 100, overflow: 'hidden',
    width: open ? 'var(--sidebar-width)' : '64px',
  }),
  logo: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', marginBottom: 4, minHeight: 40 },
  logoIcon: { fontSize: 22, color: 'var(--sage-light)', flexShrink: 0 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--white)', whiteSpace: 'nowrap' },
  logoAccent: { color: 'var(--sage-light)' },
  tagline: { fontSize: 10, color: 'rgba(255,255,255,0.3)', padding: '0 6px', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  divider: { height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 'var(--r-md)', fontSize: 13.5, fontWeight: active ? 500 : 400,
    transition: 'all 0.15s ease', whiteSpace: 'nowrap', cursor: 'pointer',
    background: active ? 'rgba(74,140,122,0.25)' : 'transparent',
    color: active ? 'var(--sage-light)' : 'rgba(255,255,255,0.5)',
    border: 'none', width: '100%', textAlign: 'left',
  }),
  navIcon: { fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 },
  activeDot: { width: 5, height: 5, borderRadius: '50%', background: 'var(--sage-light)', marginLeft: 'auto' },
  spacer: { flex: 1 },
  nudge: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(74,140,122,0.15)', border: '1px solid rgba(74,140,122,0.25)', borderRadius: 'var(--r-md)', marginBottom: 6 },
  nudgeEmoji: { fontSize: 18, flexShrink: 0 },
  nudgeStrong: { fontSize: 12, color: 'var(--sage-light)', fontWeight: 600, display: 'block' },
  nudgeSpan: { fontSize: 10.5, color: 'rgba(255,255,255,0.4)', display: 'block' },
  userChip: (open) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: open ? '10px 12px' : '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', cursor: 'pointer', justifyContent: open ? 'flex-start' : 'center' }),
  userName: { fontSize: 13, fontWeight: 500, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userMeta: { fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' },
};

export default function Sidebar({ activePage, onNavigate, user, isOpen }) {
  const mainItems   = NAV_ITEMS.filter(n => n.group === 'main');
  const bottomItems = NAV_ITEMS.filter(n => n.group === 'bottom');

  return (
    <aside style={styles.sidebar(isOpen)}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>◉</span>
        {isOpen && <span style={styles.logoText}>Mind<span style={styles.logoAccent}>Ease</span></span>}
      </div>
      {isOpen && <p style={styles.tagline}>Your wellness companion</p>}
      <div style={styles.divider} />

      <nav style={styles.nav}>
        {mainItems.map((item, i) => (
          <button key={item.id} style={styles.navItem(activePage === item.id)}
            onClick={() => onNavigate(item.id)} title={!isOpen ? item.label : undefined}>
            <span style={styles.navIcon}>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
            {activePage === item.id && isOpen && <span style={styles.activeDot} />}
          </button>
        ))}
      </nav>

      <div style={styles.spacer} />

      {isOpen && (
        <div style={styles.nudge}>
          <span style={styles.nudgeEmoji}>🌿</span>
          <div>
            <strong style={styles.nudgeStrong}>{user.streak}-day streak!</strong>
            <span style={styles.nudgeSpan}>Keep checking in daily</span>
          </div>
        </div>
      )}

      <div style={styles.divider} />

      <nav style={{ ...styles.nav, marginBottom: 12 }}>
        {bottomItems.map(item => (
          <button key={item.id} style={styles.navItem(activePage === item.id)}
            onClick={() => onNavigate(item.id)}>
            <span style={styles.navIcon}>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div style={styles.userChip(isOpen)}>
        <div className="avatar avatar-md avatar-sage">{user.initials}</div>
        {isOpen && (
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userMeta}>{user.year}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
