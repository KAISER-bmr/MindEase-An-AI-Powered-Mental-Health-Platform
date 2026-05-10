import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',  icon: '🌿', label: 'Dashboard' },
  { to: '/chat',       icon: '💬', label: 'Talk to MindEase' },
  { to: '/mood',       icon: '📊', label: 'Mood Tracker' },
  { to: '/assessment', icon: '📋', label: 'Self-Assessment' },
];

export default function Layout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const Sidebar = () => (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🌱</span>
        <span style={styles.brandName}>MindEase</span>
      </div>
      <nav style={styles.nav}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            ...styles.navItem,
            ...(isActive ? styles.navActive : {})
          })} onClick={() => setMobileOpen(false)}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={styles.userChip}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );

  return (
    <div style={styles.shell}>
      {/* Mobile overlay */}
      {mobileOpen && <div style={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Mobile header */}
      <div style={styles.mobileHeader}>
        <button style={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        <span style={styles.brandName}>🌱 MindEase</span>
      </div>

      {/* Sidebar */}
      <div style={{ ...styles.sidebarWrap, ...(mobileOpen ? styles.sidebarOpen : {}) }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--surface)' },
  sidebarWrap: {
    width: 260, flexShrink: 0,
    '@media(max-width:768px)': { position: 'fixed', zIndex: 100, transform: 'translateX(-100%)' }
  },
  sidebar: {
    width: 260, height: '100vh', position: 'fixed',
    background: 'var(--white)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    padding: '28px 0 20px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px 28px' },
  brandIcon: { fontSize: 28 },
  brandName: { fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--teal-dark)' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 14px', borderRadius: 'var(--radius-sm)',
    color: 'var(--ink-light)', fontWeight: 500, fontSize: '0.92rem',
    transition: 'all 0.15s',
  },
  navActive: {
    background: 'var(--sage-pale)', color: 'var(--teal-dark)',
    fontWeight: 600,
  },
  navIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  sidebarFooter: { padding: '16px 16px 0', borderTop: '1px solid var(--border)', marginTop: 16 },
  userChip: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--sage), var(--teal))',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.9rem',
  },
  userName: { fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' },
  userEmail: { fontSize: '0.75rem', color: 'var(--mist)' },
  logoutBtn: {
    width: '100%', padding: '9px', borderRadius: 'var(--radius-sm)',
    background: 'transparent', border: '1.5px solid var(--border)',
    color: 'var(--ink-light)', fontSize: '0.85rem', fontWeight: 500,
  },
  main: { flex: 1, marginLeft: 260, padding: '32px', overflowY: 'auto', minHeight: '100vh' },
  mobileHeader: {
    display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
    background: 'white', borderBottom: '1px solid var(--border)',
    padding: '14px 20px', alignItems: 'center', gap: 16,
  },
  hamburger: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 },
  sidebarOpen: { transform: 'translateX(0) !important' },
};
