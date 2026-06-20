'use client';
import { useEffect } from 'react';
import type { SearchResult } from '@/lib/types';
import { IconPin, IconShare, IconThumbUp, IconCalendar, IconClose } from './Icons';

// deterministic helpers ────────────────────────────────────────
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getRating(name: string) {
  const h = hash(name);
  const rating = 3.4 + (h % 16) * 0.1;         // 3.4 – 5.0
  const count  = 8 + (h % 200);                  // 8 – 207
  return { rating: Math.round(rating * 10) / 10, count };
}

type HourRange = { open: number; close: number } | null; // null = closed all day

function categoryHours(category: string, nameHash: number): HourRange {
  const cat = category.toLowerCase();
  const variation = nameHash % 60 - 30; // ±30 min
  if (cat.includes('bar') || cat.includes('pub') || cat.includes('klub'))
    return { open: 16 * 60, close: (2 + Math.floor(variation / 60 + 1)) * 60 };
  if (cat.includes('kawiarni') || cat.includes('kafe'))
    return { open: 7 * 60 + 30, close: 20 * 60 + (variation > 0 ? 30 : 0) };
  if (cat.includes('restaur') || cat.includes('jedzenie') || cat.includes('fast'))
    return { open: 11 * 60, close: 22 * 60 + (variation > 0 ? 30 : 0) };
  if (cat.includes('sklep') || cat.includes('market') || cat.includes('super'))
    return { open: 8 * 60, close: 21 * 60 };
  if (cat.includes('muzeum') || cat.includes('galeri') || cat.includes('kultura'))
    return { open: 10 * 60, close: 18 * 60 };
  if (cat.includes('fitness') || cat.includes('gym') || cat.includes('sport'))
    return { open: 6 * 60, close: 22 * 60 };
  if (cat.includes('hotel') || cat.includes('hostel'))
    return { open: 0, close: 24 * 60 }; // 24h
  if (cat.includes('park') || cat.includes('ogród'))
    return { open: 6 * 60, close: 21 * 60 };
  // default office-like
  return { open: 9 * 60, close: 18 * 60 };
}

export function getOpenStatus(name: string, category: string): { isOpen: boolean; label: string } {
  const h = hash(name);
  const hours = categoryHours(category, h);
  if (!hours) return { isOpen: false, label: 'Zamknięte' };
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const close = hours.close > 24 * 60 ? hours.close - 24 * 60 : hours.close;
  const openH = String(Math.floor(hours.open / 60)).padStart(2, '0');
  const openM = String(hours.open % 60).padStart(2, '0');
  const closeH = String(Math.floor(close / 60)).padStart(2, '0');
  const closeM = String(close % 60).padStart(2, '0');
  const label = `${openH}:${openM} – ${closeH}:${closeM}`;
  const isOpen = hours.close > 24 * 60
    ? mins >= hours.open || mins < close
    : mins >= hours.open && mins < hours.close;
  return { isOpen, label };
}

function getPhone(name: string): string {
  const h = hash(name);
  const prefix = ['22', '12', '61', '71', '58', '32'][(h % 6)];
  const num = 1000000 + (h % 9000000);
  const s = String(num);
  return `+48 ${prefix} ${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6, 9)}`.slice(0, 18);
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} gwiazdek`}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0;
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ display: 'inline', color: filled > 0 ? '#f59e0b' : 'var(--border)' }}>
            <defs>
              <linearGradient id={`sg${i}`}>
                <stop offset={`${filled * 100}%`} stopColor="#f59e0b" />
                <stop offset={`${filled * 100}%`} stopColor="var(--border)" />
              </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={`url(#sg${i})`} stroke="none" />
          </svg>
        );
      })}
    </span>
  );
}

interface Props {
  result: SearchResult;
  onClose: () => void;
  onLike: (name: string) => void;
  liked: boolean;
}

export default function DetailModal({ result, onClose, onLike, liked }: Props) {
  const { rating, count } = getRating(result.name);
  const { isOpen, label: hoursLabel } = getOpenStatus(result.name, result.category);
  const phone = result.type === 'Business' ? getPhone(result.name) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleShare = async () => {
    const text = `${result.name} – ${result.address}`;
    if (navigator.share) {
      await navigator.share({ title: result.name, text, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const mapSrc = result.lat && result.lon
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${result.lon - 0.008},${result.lat - 0.005},${result.lon + 0.008},${result.lat + 0.005}&layer=mapnik&marker=${result.lat},${result.lon}`
    : null;

  const directionsUrl = result.lat && result.lon
    ? `https://www.openstreetmap.org/directions?from=&to=${result.lat},${result.lon}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(result.address)}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><IconClose /></button>

        {/* hero image */}
        <div className="modal-hero">
          <img src={result.image ?? `https://source.unsplash.com/800x400/?${encodeURIComponent(result.category)}`}
            alt={result.name} className="modal-hero-img" />
          <div className="modal-hero-gradient" />
          <div className="modal-hero-text">
            <span className={`modal-open-badge ${isOpen ? 'open' : 'closed'}`}>
              {isOpen ? 'Otwarte' : 'Zamknięte'}
            </span>
            <h2 className="modal-title">{result.name}</h2>
            <span className="modal-category">{result.category}</span>
          </div>
        </div>

        <div className="modal-body">
          {/* rating row */}
          <div className="modal-rating-row">
            <Stars rating={rating} />
            <span className="modal-rating-num">{rating.toFixed(1)}</span>
            <span className="modal-rating-count">({count} opinii)</span>
            <span className="modal-hours-sep">·</span>
            <span className="modal-hours">{hoursLabel}</span>
          </div>

          {/* description */}
          <p className="modal-desc">{result.description}</p>

          {/* info rows */}
          <div className="modal-info">
            <div className="modal-info-row">
              <IconPin />
              <span>{result.address}</span>
            </div>
            {result.eventDate && (
              <div className="modal-info-row">
                <IconCalendar />
                <span>{new Date(result.eventDate).toLocaleString('pl-PL', { dateStyle: 'full', timeStyle: 'short' })}</span>
              </div>
            )}
            {phone && (
              <div className="modal-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                </svg>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="modal-phone">{phone}</a>
              </div>
            )}
            <div className="modal-info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{result.distance.toFixed(2)} km od Ciebie</span>
            </div>
          </div>

          {/* action buttons */}
          <div className="modal-actions">
            <button className={`modal-action-btn${liked ? ' liked' : ''}`} onClick={() => onLike(result.name)}>
              <IconThumbUp /> {liked ? 'Lubisz to' : 'Lubię to'}
            </button>
            <button className="modal-action-btn" onClick={handleShare}>
              <IconShare /> Udostępnij
            </button>
            <a className="modal-action-btn" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <IconPin /> Trasa
            </a>
          </div>

          {/* tags */}
          {result.tags.length > 0 && (
            <div className="modal-tags">
              {result.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
            </div>
          )}

          {/* map */}
          {mapSrc && (
            <div className="modal-map">
              <iframe src={mapSrc} width="100%" height="220" style={{ border: 0, borderRadius: 10 }} loading="lazy" title="Mapa" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
