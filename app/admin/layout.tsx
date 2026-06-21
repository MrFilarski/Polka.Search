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
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-icon">🔐</div>
        <h2 className="admin-login-title">Polka.Search Admin</h2>
        <p className="admin-login-sub">Panel administratora</p>
        <input
          className="admin-login-input"
          type="password"
          placeholder="hasło administratora"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
        />
        {err && <p className="admin-login-error">{err}</p>}
        <button className="admin-login-btn" onClick={login}>Zaloguj się</button>
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-accent">Polka</span>
          <span className="admin-logo-dim">.Admin</span>
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
