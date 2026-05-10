import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import Assessment from './pages/Assessment';
import Settings from './pages/Settings';
import './index.css';

function AppShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
      Loading…
    </div>
  );

  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  if (!user && !isAuth) return <Navigate to="/login" replace />;
  if (user && isAuth) return <Navigate to="/dashboard" replace />;

  if (isAuth) return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );

  const activePage = location.pathname.replace('/', '') || 'dashboard';
  const userObj = {
    name: user.name,
    initials: user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U',
    streak: 7,
    year: 'Student',
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={page => navigate(`/${page}`)}
        user={userObj}
        isOpen={sidebarOpen}
      />
      <div className={`main-content ${sidebarOpen ? '' : 'collapsed'}`}>
        <Topbar
          activePage={activePage}
          user={userObj}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onNavigate={page => navigate(`/${page}`)}
        />
        <main className="page-content">
          <Routes>
            <Route path="/dashboard"  element={<Dashboard user={userObj} onNavigate={page => navigate(`/${page}`)} />} />
            <Route path="/chat"       element={<Chat />} />
            <Route path="/mood"       element={<MoodTracker />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/settings"   element={<Settings />} />
            <Route path="*"           element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
