import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getSessions, getMessages } from '../api';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  "I'm feeling anxious about my exams",
  "I've been having trouble sleeping",
  "I feel lonely and disconnected",
  "I'm overwhelmed with coursework",
];

export default function Chat() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getSessions().then(r => setSessions(r.data || [])).catch(() => {});
    setMessages([{
      id: 'welcome', sender: 'bot',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'} 🌿 I'm your MindEase AI companion — a safe, confidential space to talk. I'm here to listen and support you. How are you feeling today?`,
    }]);
  }, [user?.name]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const loadSession = async (sid) => {
    try {
      const res = await getMessages(sid);
      const msgs = (res.data || []).map(m => ({ id: m.id, sender: m.role === 'user' ? 'user' : 'bot', text: m.content }));
      setMessages(msgs.length ? msgs : [{ id: 'w', sender: 'bot', text: 'What would you like to talk about?' }]);
      setSessionId(sid);
      setSidebarOpen(false);
    } catch {}
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await sendMessage({ content: msg, session_id: sessionId });
      setSessionId(res.data.session_id);
      setMessages(prev => [...prev, { id: res.data.ai_message.id, sender: 'bot', text: res.data.ai_message.content }]);
      getSessions().then(r => setSessions(r.data || [])).catch(() => {});
    } catch {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: "I'm having trouble connecting. If you're in crisis, please call iCall: 9152987821." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--gap-lg)', height: 'calc(100vh - var(--topbar-height) - 48px)', minHeight: 500 }}>

      {/* Sessions sidebar */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 4px', marginBottom: 4 }}>
          Conversations
        </div>

        {/* AI contact */}
        <div className="card" style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11, border: '1.5px solid var(--sage)', background: 'var(--sage-ghost)' }}>
          <div className="avatar avatar-md avatar-sage">AI</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>MindEase AI</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Available 24/7</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 2px white' }} />
        </div>

        {/* Past sessions */}
        {sessions.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 4px 2px' }}>
              Past sessions
            </div>
            {sessions.slice(0, 6).map(s => (
              <button key={s.id} onClick={() => loadSession(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px',
                borderRadius: 'var(--r-md)', background: 'var(--white)',
                border: '1px solid var(--border-subtle)', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                <div className="avatar avatar-md avatar-sage" style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}>#{s.id}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Session #{s.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.message_count} messages</div>
                </div>
              </button>
            ))}
          </>
        )}

        {/* New chat */}
        <button onClick={() => { setSessionId(null); setMessages([{ id: 'w', sender: 'bot', text: "Hi again! What's on your mind?" }]); }}
          className="btn btn-outline" style={{ marginTop: 'auto', fontSize: 13, padding: '9px' }}>
          + New conversation
        </button>

        {/* Privacy note */}
        <div style={{ display: 'flex', gap: 8, padding: 12, background: 'var(--sage-ghost)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <span>🔒</span>
          <span>All conversations are confidential.</span>
        </div>
      </aside>

      {/* Chat window */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px var(--gap-lg)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="avatar avatar-md avatar-sage">AI</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>MindEase AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
              Online · Confidential · Always available
            </div>
          </div>
          <span className="badge badge-sage">🛡 Private</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--gap-lg)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              {msg.sender === 'bot' && <div className="avatar avatar-sm avatar-sage">AI</div>}
              <div style={{
                maxWidth: '72%', padding: '12px 16px', borderRadius: 18, fontSize: 14, lineHeight: 1.55,
                background: msg.sender === 'bot' ? 'var(--sage-ghost)' : 'var(--sage)',
                color: msg.sender === 'bot' ? 'var(--text-primary)' : 'white',
                borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 18,
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 18,
              }}>
                {msg.text}
              </div>
              {msg.sender === 'user' && <div className="avatar avatar-sm avatar-warm">{user?.name?.[0] || 'U'}</div>}
            </div>
          ))}

          {/* Typing */}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div className="avatar avatar-sm avatar-sage">AI</div>
              <div style={{ display: 'flex', gap: 4, padding: '13px 16px', background: 'var(--sage-ghost)', borderRadius: 18, borderBottomLeftRadius: 4 }}>
                {[0,0.2,0.4].map((d,i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sage)', animation: `typingBounce 1.2s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.filter(m => m.sender === 'user').length === 0 && (
          <div style={{ padding: '0 var(--gap-lg) 12px', display: 'flex', flexWrap: 'wrap', gap: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => send(p)} style={{
                padding: '7px 14px', background: 'var(--parchment)',
                border: '1px solid var(--border-light)', borderRadius: 'var(--r-full)',
                fontSize: 12.5, color: 'var(--text-secondary)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage-pale)'; e.currentTarget.style.borderColor = 'var(--sage)'; e.currentTarget.style.color = 'var(--forest-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--parchment)'; e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, padding: 'var(--gap-md) var(--gap-lg)', borderTop: '1px solid var(--border-subtle)' }}>
          <textarea
            className="input"
            placeholder="Share what's on your mind… (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            style={{ resize: 'none', lineHeight: 1.5, alignSelf: 'center' }}
          />
          <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()} style={{ alignSelf: 'flex-end', padding: '10px 20px' }}>
            Send ↑
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-ghost)', padding: '0 16px 10px' }}>
          MindEase provides emotional support, not professional therapy. In crisis, call iCall: 9152987821
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
