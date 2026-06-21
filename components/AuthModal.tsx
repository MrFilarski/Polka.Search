'use client';
import { useState } from 'react';
import { IconClose } from './Icons';

export interface UserProfile {
  name: string;
  email: string;
  dotColor: string;
  enabledCats?: string[];
  likes?: string[];
  createdAt: string;
}

const DOT_COLORS = [
  { id: 'red',    hex: '#e8003d', label: 'Czerwony' },
  { id: 'blue',   hex: '#3b82f6', label: 'Niebieski' },
  { id: 'green',  hex: '#22c55e', label: 'Zielony' },
  { id: 'purple', hex: '#a855f7', label: 'Fioletowy' },
  { id: 'orange', hex: '#f97316', label: 'Pomarańczowy' },
  { id: 'pink',   hex: '#ec4899', label: 'Różowy' },
  { id: 'cyan',   hex: '#06b6d4', label: 'Cyjan' },
  { id: 'yellow', hex: '#eab308', label: 'Żółty' },
];

function hashPassword(pw: string): string {
  // simple non-crypto hash — good enough for localStorage demo
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return String(h);
}

function loadUsers(): Record<string, UserProfile & { pwHash: string }> {
  try { return JSON.parse(localStorage.getItem('ps_users') ?? '{}'); } catch { return {}; }
}

function saveUsers(users: Record<string, UserProfile & { pwHash: string }>) {
  localStorage.setItem('ps_users', JSON.stringify(users));
}

interface Props {
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}

export default function AuthModal({ onClose, onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dotColor, setDotColor] = useState('#e8003d');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const users = loadUsers();

    if (mode === 'register') {
      if (!name.trim()) { setError('Podaj imię.'); setLoading(false); return; }
      if (!email.includes('@')) { setError('Nieprawidłowy e-mail.'); setLoading(false); return; }
      if (password.length < 6) { setError('Hasło min. 6 znaków.'); setLoading(false); return; }
      if (users[email]) { setError('Konto z tym e-mailem już istnieje.'); setLoading(false); return; }

      const profile: UserProfile = { name: name.trim(), email, dotColor, createdAt: new Date().toISOString() };
      users[email] = { ...profile, pwHash: hashPassword(password) };
      saveUsers(users);
      localStorage.setItem('ps_current_user', email);
      onLogin(profile);
    } else {
      const user = users[email];
      if (!user || user.pwHash !== hashPassword(password)) {
        setError('Nieprawidłowy e-mail lub hasło.');
        setLoading(false); return;
      }
      localStorage.setItem('ps_current_user', email);
      const { pwHash: _, ...profile } = user;
      onLogin(profile);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="feedback-backdrop" onClick={onClose}>
      <div className="feedback-modal auth-modal" onClick={e => e.stopPropagation()}>
        <button className="feedback-close" onClick={onClose}><IconClose /></button>

        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Zaloguj się</button>
          <button className={`auth-tab${mode === 'register' ? ' active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Zarejestruj się</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {mode === 'register' && (
            <>
              <label className="feedback-label">Imię</label>
              <input className="feedback-input" value={name} onChange={e => setName(e.target.value)} placeholder="Jak masz na imię?" autoFocus />
            </>
          )}

          <label className="feedback-label">E-mail</label>
          <input className="feedback-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="twoj@email.pl" autoFocus={mode === 'login'} />

          <label className="feedback-label">Hasło</label>
          <input className="feedback-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Minimum 6 znaków' : '••••••••'} />

          {mode === 'register' && (
            <>
              <label className="feedback-label" style={{ marginTop: 16 }}>Kolor kropki na awatarze</label>
              <div className="auth-color-grid">
                {DOT_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`auth-color-btn${dotColor === c.hex ? ' selected' : ''}`}
                    style={{ '--dot': c.hex } as React.CSSProperties}
                    onClick={() => setDotColor(c.hex)}
                    title={c.label}
                  >
                    <span className="auth-color-dot" />
                    {dotColor === c.hex && (
                      <svg className="auth-color-check" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="feedback-submit" style={{ marginTop: 20 }} disabled={loading}>
            {loading ? '…' : mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { DOT_COLORS };
