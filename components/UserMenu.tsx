'use client';
import { useState, useRef, useEffect } from 'react';
import type { UserProfile } from './AuthModal';
import { DOT_COLORS } from './AuthModal';

interface Props {
  profile: UserProfile;
  onLogout: () => void;
  onUpdateColor: (color: string) => void;
}

function Avatar({ profile, size = 32 }: { profile: UserProfile; size?: number }) {
  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const dotSize = Math.round(size * 0.34);
  return (
    <span className="user-avatar" style={{ width: size, height: size }}>
      <span className="user-avatar-initials" style={{ fontSize: size * 0.38 }}>{initials}</span>
      <span className="user-avatar-dot" style={{ background: profile.dotColor, width: dotSize, height: dotSize }} />
    </span>
  );
}

export { Avatar };

export default function UserMenu({ profile, onLogout, onUpdateColor }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="user-menu-wrap" ref={ref}>
      <button className="user-menu-btn" onClick={() => setOpen(o => !o)} title={profile.name}>
        <Avatar profile={profile} />
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <Avatar profile={profile} size={40} />
            <div>
              <div className="user-menu-name">{profile.name}</div>
              <div className="user-menu-email">{profile.email}</div>
            </div>
          </div>

          <div className="user-menu-section-label">Kolor kropki</div>
          <div className="auth-color-grid" style={{ padding: '0 14px 12px' }}>
            {DOT_COLORS.map(c => (
              <button
                key={c.id}
                type="button"
                className={`auth-color-btn${profile.dotColor === c.hex ? ' selected' : ''}`}
                style={{ '--dot': c.hex } as React.CSSProperties}
                onClick={() => onUpdateColor(c.hex)}
                title={c.label}
              >
                <span className="auth-color-dot" />
                {profile.dotColor === c.hex && (
                  <svg className="auth-color-check" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="user-menu-divider" />
          <button className="user-menu-logout" onClick={() => { setOpen(false); onLogout(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
}
