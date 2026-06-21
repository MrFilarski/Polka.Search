'use client';
import '@/app/admin.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/places',    label: 'Miejsca',   icon: '📍' },
  { href: '/admin/users',     label: 'Użytkownicy', icon: '👥' },
  { href: '/admin/system',    label: 'System',    icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    setAuthed(sessionStorage.getItem('admin_authed') === '1');
  }, []);

  const login = async () => {
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': pw } });
    if (res.ok) { sessionStorage.setItem('admin_authed', '1'); sessionStorage.setItem('admin_pw', pw); setAuthed(true); }
    else setErr('Złe hasło');
  };

  if (authed === null) return null;

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
      <div style={{ background: '#111118', border: '1px solid #222', borderRadius: 16, padding: '40px 48px', width: 340, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.3rem' }}>Polka.Search Admin</h2>
        <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 24px' }}>Panel administratora</p>
        <input
          type="password"
          placeholder="Hasło administratora"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: '10px 14px', background: '#0a0a0f', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
        />
        {err && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: '8px 0 0' }}>{err}</p>}
        <button onClick={login} style={{ marginTop: 14, width: '100%', padding: '10px', background: '#e8003d', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
          Zaloguj się
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span style={{ color: '#e8003d', fontWeight: 800 }}>Polka</span>
          <span style={{ color: '#fff', fontWeight: 300 }}>.Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className={`admin-nav-item${path.startsWith(n.href) ? ' active' : ''}`}>
              <span className="admin-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item">
            <span className="admin-nav-icon">↩</span>
            <span>Wróć do apki</span>
          </Link>
          <button className="admin-nav-item" style={{ width: '100%', cursor: 'pointer' }}
            onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false); }}>
            <span className="admin-nav-icon">🚪</span>
            <span>Wyloguj</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
