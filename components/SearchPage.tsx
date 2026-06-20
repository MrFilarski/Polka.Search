'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SearchResult, BusinessUpdate } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/i18n';
import PolkaDotBackground from './PolkaDotBackground';
import { IconSearch, IconSun, IconMoon, IconPin, IconEdit, IconShare, IconThumbUp, IconComment, IconCalendar, IconStore, IconTag, IconNews, IconDiscount } from './Icons';
import { getPlaceImage } from '@/lib/images';
import AiSearchBar from './AiSearchBar';

interface Props {
  initialResults: SearchResult[];
  initialUpdates: BusinessUpdate[];
  locale: Locale;
  defaultLat: number;
  defaultLon: number;
  defaultRadius: number;
}

const CATEGORIES = [
  { label: 'Odkryj',   filter: '' },
  { label: 'Jedzenie', filter: 'jedzenie' },
  { label: 'Zniżki',   filter: 'znizki' },
  { label: 'Bary',     filter: 'bar' },
  { label: 'Fitness',  filter: 'fitness' },
  { label: 'Sklepy',   filter: 'sklep' },
  { label: 'Kultura',  filter: 'muzeum' },
  { label: 'Eventy',   filter: 'event' },
];

function cardImg(result: SearchResult): string {
  if (result.image) return result.image;
  return getPlaceImage(result.name, result.category, result.tags, 640, 360);
}

function thumbImg(result: SearchResult): string {
  if (result.image) return result.image;
  return getPlaceImage(result.name, result.category, result.tags, 120, 90);
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 60) return `${diff} min temu`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h} godz. temu`;
  return `${Math.floor(h / 24)} dni temu`;
}

function HeroCard({ result, isDeal }: { result: SearchResult; isDeal?: boolean }) {
  return (
    <div className={`hero-card${isDeal ? ' deal-card' : ''}`}>
      <div className="hero-img-wrap">
        <img src={cardImg(result)} alt={result.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div className="hero-gradient" />
      </div>
      <div className="hero-body">
        <span className="cat-badge">{result.type === 'Event' ? <><IconCalendar /> Wydarzenie</> : <><IconStore /> Miejsce</>}</span>
        <h2 className="hero-title">{result.name}</h2>
        <p className="hero-desc">{result.description}</p>
        <div className="card-meta">
          <span style={{display:'flex',alignItems:'center',gap:4}}><IconPin /> {result.address}</span>
          <span>· {result.distance.toFixed(2)} km</span>
          {result.eventDate && <span>· {new Date(result.eventDate).toLocaleDateString('pl-PL')}</span>}
        </div>
        <div className="card-actions">
          <button className="action-btn"><IconThumbUp /> Lubię</button>
          <button className="action-btn"><IconComment /> Komentuj</button>
          <button className="action-btn"><IconShare /> Udostępnij</button>
        </div>
      </div>
    </div>
  );
}

function GridCard({ result, isDeal }: { result: SearchResult; isDeal?: boolean }) {
  return (
    <div className={`grid-card${isDeal ? ' deal-card' : ''}`}>
      <div className="grid-img-wrap">
        <img src={cardImg(result)} alt={result.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div className="grid-body">
        <span className="source-label">{result.category} · {result.distance.toFixed(2)} km</span>
        <h3 className="grid-title">{result.name}</h3>
        <p className="grid-desc">{result.description}</p>
        <div className="card-actions small">
          <button className="action-btn"><IconThumbUp /></button>
          <button className="action-btn"><IconComment /></button>
        </div>
      </div>
    </div>
  );
}

function SideListCard({ result, rank }: { result: SearchResult; rank: number }) {
  return (
    <div className="side-item">
      <span className="side-rank">{rank}</span>
      <div className="side-body">
        <h4 className="side-title">{result.name}</h4>
        <span className="side-meta">{result.category} · {result.distance.toFixed(2)} km</span>
      </div>
      <div className="side-thumb">
        <img src={thumbImg(result)} alt={result.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function UpdateCard({ update }: { update: BusinessUpdate }) {
  return (
    <div className="update-card">
      <div className="update-top">
        <span className="update-icon-lg">
          {update.updateType === 'deal' ? <IconDiscount /> : update.updateType === 'event' ? <IconCalendar /> : <IconNews />}
        </span>
        <div className="update-meta-wrap">
          <div className="update-biz">{update.businessName}</div>
          <div className="update-source">{update.category} · {timeAgo(update.postedAt)}</div>
        </div>
        <span className={`update-badge ${update.updateType}`}>{update.updateType.toUpperCase()}</span>
      </div>
      <p className="update-text">{update.content}</p>
      <div className="update-footer">
        <button className="action-btn small"><IconThumbUp /> {update.likes}</button>
        <button className="action-btn small"><IconComment /></button>
        <button className="action-btn small"><IconShare /></button>
      </div>
    </div>
  );
}

export default function SearchPage({ initialResults, initialUpdates, locale, defaultLat, defaultLon, defaultRadius }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getTranslations(locale);

  const [query, setQuery] = useState(searchParams.get('query') ?? '');
  const [latitude, setLatitude] = useState(String(defaultLat));
  const [longitude, setLongitude] = useState(String(defaultLon));
  const [radius, setRadius] = useState(String(defaultRadius));
  const [locationLabel, setLocationLabel] = useState('Mokotów, Warszawa');
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dark, setDark] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') setDark(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const doSearch = useCallback(async (q: string, lat: string, lon: string, rad: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query: q, latitude: lat, longitude: lon, radius: rad });
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Błąd serwera');
      const data = await res.json();
      setResults(data.results);
      router.replace(`/?${params}&lang=${locale}`, { scroll: false });
    } catch {
      setError('Nie udało się pobrać danych. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  }, [locale, router]);

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    doSearch(CATEGORIES[idx].filter, latitude, longitude, radius);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    doSearch(query, latitude, longitude, radius);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setAddressOpen(true);
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = String(pos.coords.latitude.toFixed(6));
        const lon = String(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lon);
        setLocationLabel(`${parseFloat(lat).toFixed(4)}°N, ${parseFloat(lon).toFixed(4)}°E`);
        setLocating(false);
        // Reverse geocode for human-readable label
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pl`, {
          headers: { 'User-Agent': 'PolkaSearch/1.0' },
        })
          .then(r => r.json())
          .then(d => {
            const addr = d.address;
            const label = [addr?.road, addr?.suburb ?? addr?.neighbourhood, addr?.city ?? addr?.town].filter(Boolean).join(', ');
            if (label) setLocationLabel(label);
          })
          .catch(() => {});
        doSearch(CATEGORIES[activeTab].filter || query, lat, lon, radius);
      },
      () => {
        setLocating(false);
        setAddressOpen(true); // fallback: show address input
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleGeocodeAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setLocating(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: addressInput,
        format: 'json',
        limit: '1',
        'accept-language': 'pl',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'User-Agent': 'PolkaSearch/1.0' },
      });
      const data = await res.json();
      if (!data[0]) throw new Error('Nie znaleziono adresu');
      const lat = String(parseFloat(data[0].lat).toFixed(6));
      const lon = String(parseFloat(data[0].lon).toFixed(6));
      const label = data[0].display_name.split(',').slice(0, 3).join(',').trim();
      setLatitude(lat);
      setLongitude(lon);
      setLocationLabel(label);
      setAddressOpen(false);
      setAddressInput('');
      doSearch(CATEGORIES[activeTab].filter || query, lat, lon, radius);
    } catch {
      setError('Nie znaleziono podanego adresu. Spróbuj inaczej.');
    } finally {
      setLocating(false);
    }
  };

  const switchLang = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.push(`/?${params}`);
  };

  const isDeals = CATEGORIES[activeTab]?.filter === 'znizki';
  const hero = results[0];
  const gridCards = results.slice(1, 4);
  const sideList = results.slice(0, 5);
  const bottomCards = results.slice(4);

  return (
    <>
    <PolkaDotBackground />
    <div className="portal">
      <nav className="top-nav">
        <div className="nav-inner">
          <a className="nav-logo" href="/">Polka<span>.Search</span></a>

          <div className="nav-tabs">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                className={`nav-tab${activeTab === i ? ' active' : ''}${cat.filter === 'znizki' ? ' deal-tab' : ''}`}
                onClick={() => handleTabClick(i)}
              >
                {cat.filter === 'znizki' ? <><IconDiscount /> </> : null}{cat.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <button className="icon-btn" onClick={() => setSearchOpen(s => !s)} title="Szukaj"><IconSearch /></button>
            <button className="icon-btn" onClick={() => setDark(d => !d)} title="Motyw">{dark ? <IconSun /> : <IconMoon />}</button>
            {(['en', 'pl', 'uk'] as const).map(lang => (
              <button key={lang} className="lang-pill" onClick={() => switchLang(lang)}>{lang.toUpperCase()}</button>
            ))}
            <button className="personalize-btn">✦ Personalizuj</button>
          </div>
        </div>

        {searchOpen && (
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="search-input"
            />
            <input
              type="number"
              value={radius}
              onChange={e => setRadius(e.target.value)}
              min="0.1"
              max="50"
              step="0.5"
              className="search-input radius-input"
              title="Promień (km)"
            />
            <span className="radius-label">km</span>
            <button type="submit" className="search-submit">Szukaj</button>
          </form>
        )}
      </nav>

      {/* Address input dropdown */}
      {addressOpen && (
        <form className="search-bar" onSubmit={handleGeocodeAddress}>
          <input
            autoFocus
            type="text"
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            placeholder="Wpisz adres, ulicę lub miasto…"
            className="search-input"
          />
          <button type="submit" className="search-submit" disabled={locating}>
            {locating ? '⏳' : 'Szukaj'}
          </button>
          <button type="button" className="search-submit" style={{ background: 'var(--bg3)', color: 'var(--text2)' }} onClick={() => setAddressOpen(false)}>
            ✕
          </button>
        </form>
      )}

      {/* Location info bar */}
      <div className="location-bar">
        <span className="location-text">
          <IconPin />&nbsp;<strong>{locationLabel}</strong>
          &nbsp;·&nbsp; promień: {radius} km
          &nbsp;·&nbsp; {loading ? 'ładowanie…' : `${results.length} wyników`}
        </span>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button className="locate-mini-btn" onClick={() => setAddressOpen(a => !a)}>
            <IconEdit /> Zmień adres
          </button>
          <button className="locate-mini-btn" onClick={handleGeolocate} disabled={locating}>
            <IconPin />{locating ? ' Lokalizuję…' : ' GPS'}
          </button>
        </div>
      </div>

      {error && <div className="error-bar">{error} <button onClick={() => setError(null)}>✕</button></div>}

      <AiSearchBar
        latitude={latitude}
        longitude={longitude}
        locationLabel={locationLabel}
        onSearch={(q) => { doSearch(q, latitude, longitude, radius); }}
      />

      <main className="portal-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Pobieranie danych z okolicy…</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <p>Brak wyników w promieniu {radius} km. Spróbuj zwiększyć promień lub zmień lokalizację.</p>
          </div>
        ) : (
          <>
            <div className="primary-row">
              <div className="primary-left">
                {hero && <HeroCard result={hero} isDeal={isDeals} />}
              </div>
              <aside className="primary-side">
                <h3 className="side-heading">Najlepsze w pobliżu</h3>
                {sideList.map((r, i) => <SideListCard key={i} result={r} rank={i + 1} />)}
              </aside>
            </div>

            {gridCards.length > 0 && (
              <div className="grid-row">
                {gridCards.map((r, i) => <GridCard key={i} result={r} isDeal={isDeals} />)}
              </div>
            )}

            {bottomCards.length > 0 && (
              <div className="grid-row">
                {bottomCards.map((r, i) => <GridCard key={i} result={r} isDeal={isDeals} />)}
              </div>
            )}
          </>
        )}

        <section className="updates-section">
          <h3 className="section-heading">Aktualności od lokalnych firm</h3>
          <div className="updates-grid">
            {initialUpdates.map((u, i) => <UpdateCard key={i} update={u} />)}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
