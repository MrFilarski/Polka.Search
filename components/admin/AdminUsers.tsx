'use client';
import { useEffect, useState } from 'react';

interface User { name: string; email: string; dotColor: string; createdAt: string; likes?: string[]; enabledCats?: string[] }

const DOT_COLORS: Record<string, string> = {
  red: '#e8003d', blue: '#3b82f6', green: '#10b981', purple: '#8b5cf6',
  orange: '#f97316', pink: '#ec4899', cyan: '#06b6d4', yellow: '#eab308',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ps_users');
      if (raw) {
        const obj = JSON.parse(raw);
        setUsers(Object.values(obj) as User[]);
      }
    } catch { /* ignore */ }
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-h1">Użytkownicy</h1>
        <span className="admin-badge">{users.length} kont</span>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty">
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <h3>Brak zarejestrowanych użytkowników</h3>
          <p>Użytkownicy są przechowywani w localStorage przeglądarki. Po migracji do Supabase pojawią się tutaj.</p>
        </div>
      ) : (
        <>
          <div className="admin-toolbar">
            <input className="admin-search" placeholder="🔍  Szukaj po nazwie lub emailu…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Użytkownik</th>
                  <th>Email</th>
                  <th>Kolor</th>
                  <th>Rejestracja</th>
                  <th>Polubienia</th>
                  <th>Kategorie</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.75rem', position: 'relative', flexShrink: 0 }}>
                          {getInitials(u.name)}
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: DOT_COLORS[u.dotColor] ?? '#e8003d', border: '2px solid #111' }} />
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: '#888' }}>{u.email}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: DOT_COLORS[u.dotColor] ?? '#e8003d', display: 'inline-block' }} />
                        {u.dotColor}
                      </span>
                    </td>
                    <td style={{ color: '#666', fontSize: '0.82rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('pl-PL')}
                    </td>
                    <td><span className="admin-badge">{u.likes?.length ?? 0}</span></td>
                    <td style={{ fontSize: '0.82rem', color: '#888' }}>{u.enabledCats?.length ?? 0} aktywnych</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="admin-info-box" style={{ marginTop: 24 }}>
        <strong>ℹ️ Uwaga:</strong> Dane użytkowników są przechowywane w <code>localStorage</code> przeglądarki. Migracja do Supabase pozwoli synchronizować je między urządzeniami i zarządzać z tego panelu.
      </div>
    </div>
  );
}
