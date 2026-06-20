'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SearchResult, BusinessUpdate } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/i18n';
import PolkaDotBackground from './PolkaDotBackground';
import {
  IconSun, IconMoon, IconPin, IconShare, IconThumbUp, IconComment,
  IconCalendar, IconStore, IconNews, IconDiscount, IconChevronLeft, IconChevronRight, IconSliders,
  IconWeatherSun, IconWeatherCloud, IconWeatherPartly, IconWeatherRain,
  IconWeatherSnow, IconWeatherThunder, IconWeatherFog,
  IconSearch16, IconUsers,
} from './Icons';
import { getPlaceImage } from '@/lib/images';
import AiSearchBar from './AiSearchBar';
import NewsTicker from './NewsTicker';
import DetailModal, { getRating, getOpenStatus } from './DetailModal';
import FeedbackModal from './FeedbackModal';

interface Props {
  initialResults: SearchResult[];
  initialUpdates: BusinessUpdate[];
  locale: Locale;
  defaultLat: number;
  defaultLon: number;
  defaultRadius: number;
}

const ALL_CATEGORIES = [
  { label: 'Odkryj',    filter: '',          alwaysOn: true },
  { label: 'Jedzenie',  filter: 'jedzenie' },
  { label: 'Zniżki',   filter: 'znizki',   isDeals: true },
  { label: 'Bary',      filter: 'bar' },
  { label: 'Fitness',   filter: 'fitness' },
  { label: 'Sklepy',    filter: 'sklep' },
  { label: 'Kultura',   filter: 'muzeum' },
  { label: 'Eventy',    filter: 'event' },
  { label: 'Kawiarnie', filter: 'kawiarnia' },
  { label: 'Parki',     filter: 'park' },
  { label: 'Zdrowie',   filter: 'zdrowie' },
  { label: 'Transport', filter: 'transport' },
  { label: 'Hotele',    filter: 'hotel' },
  { label: 'Edukacja',  filter: 'edukacja' },
  { label: 'Sport',     filter: 'sport' },
  { label: 'Usługi',    filter: 'uslugi' },
  { label: 'Rozrywka',  filter: 'rozrywka' },
];

const DEFAULT_ACTIVE = new Set(['Odkryj','Jedzenie','Zniżki','Bary','Fitness','Sklepy','Kultura','Eventy']);

function weatherIcon(code: number): React.ReactNode {
  const s = 15;
  if (code === 0)  return <IconWeatherSun size={s} />;
  if (code <= 2)   return <IconWeatherPartly size={s} />;
  if (code === 3)  return <IconWeatherCloud size={s} />;
  if (code <= 49)  return <IconWeatherFog size={s} />;
  if (code <= 67)  return <IconWeatherRain size={s} />;
  if (code <= 77)  return <IconWeatherSnow size={s} />;
  if (code <= 82)  return <IconWeatherRain size={s} />;
  if (code <= 86)  return <IconWeatherSnow size={s} />;
  if (code <= 99)  return <IconWeatherThunder size={s} />;
  return <IconWeatherCloud size={s} />;
}

function weatherDesc(code: number): string {
  if (code === 0)  return 'Bezchmurnie';
  if (code <= 2)   return 'Częściowe zachmurzenie';
  if (code === 3)  return 'Zachmurzenie';
  if (code <= 49)  return 'Mgła';
  if (code <= 67)  return 'Deszcz';
  if (code <= 77)  return 'Śnieg';
  if (code <= 82)  return 'Przelotny deszcz';
  if (code <= 86)  return 'Przelotny śnieg';
  if (code <= 99)  return 'Burza';
  return 'Zmienne';
}

function cardImg(r: SearchResult) { return r.image || getPlaceImage(r.name, r.category, r.tags, 640, 360); }
function thumbImg(r: SearchResult) { return r.image || getPlaceImage(r.name, r.category, r.tags, 120, 90); }
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 60) return `${diff} min temu`;
  const h = Math.floor(diff / 60);
  return h < 24 ? `${h} godz. temu` : `${Math.floor(h / 24)} dni temu`;
}

function HeroCard({ result, isDeal, onClick, liked, onLike }: { result: SearchResult; isDeal?: boolean; onClick: () => void; liked: boolean; onLike: () => void }) {
  const { rating, count } = getRating(result.name);
  const { isOpen } = getOpenStatus(result.name, result.category);
  return (
    <div className={`hero-card${isDeal ? ' deal-card' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="hero-img-wrap">
        <img src={cardImg(result)} alt={result.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div className="hero-gradient" />
        <span className={`card-open-badge ${isOpen ? 'open' : 'closed'}`}>{isOpen ? 'Otwarte' : 'Zamknięte'}</span>
      </div>
      <div className="hero-body">
        <span className="cat-badge">{result.type === 'Event' ? <><IconCalendar /> Wydarzenie</> : <><IconStore /> Miejsce</>}</span>
        <h2 className="hero-title">{result.name}</h2>
        <div className="card-rating">
          <span className="rating-stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
          <span className="rating-num">{rating.toFixed(1)}</span>
          <span className="rating-count">({count})</span>
        </div>
        <p className="hero-desc">{result.description}</p>
        <div className="card-meta">
          <span style={{display:'flex',alignItems:'center',gap:4}}><IconPin /> {result.address}</span>
          <span>· {result.distance.toFixed(2)} km</span>
        </div>
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button className={`action-btn${liked ? ' liked' : ''}`} onClick={onLike}><IconThumbUp /> {liked ? 'Lubisz' : 'Lubię'}</button>
          <button className="action-btn"><IconComment /> Komentuj</button>
          <button className="action-btn" onClick={async () => {
            if (navigator.share) await navigator.share({ title: result.name, url: window.location.href }).catch(() => {});
            else await navigator.clipboard.writeText(`${result.name} – ${result.address}`).catch(() => {});
          }}><IconShare /> Udostępnij</button>
        </div>
      </div>
    </div>
  );
}

function GridCard({ result, isDeal, onClick, liked, onLike }: { result: SearchResult; isDeal?: boolean; onClick: () => void; liked: boolean; onLike: () => void }) {
  const { rating } = getRating(result.name);
  const { isOpen } = getOpenStatus(result.name, result.category);
  return (
    <div className={`grid-card${isDeal ? ' deal-card' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="grid-img-wrap">
        <img src={cardImg(result)} alt={result.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <span className={`card-open-badge ${isOpen ? 'open' : 'closed'}`}>{isOpen ? 'Otwarte' : 'Zamknięte'}</span>
      </div>
      <div className="grid-body">
        <span className="source-label">{result.category} · {result.distance.toFixed(2)} km</span>
        <h3 className="grid-title">{result.name}</h3>
        <div className="card-rating small">
          <span className="rating-stars small">{'★'.repeat(Math.round(rating))}</span>
          <span className="rating-num">{rating.toFixed(1)}</span>
        </div>
        <p className="grid-desc">{result.description}</p>
        <div className="card-actions small" onClick={e => e.stopPropagation()}>
          <button className={`action-btn${liked ? ' liked' : ''}`} onClick={onLike}><IconThumbUp /></button>
          <button className="action-btn"><IconComment /></button>
        </div>
      </div>
    </div>
  );
}

function SideListCard({ result, rank, onClick }: { result: SearchResult; rank: number; onClick: () => void }) {
  const { rating } = getRating(result.name);
  const { isOpen } = getOpenStatus(result.name, result.category);
  return (
    <div className="side-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <span className="side-rank">{rank}</span>
      <div className="side-body">
        <h4 className="side-title">{result.name}</h4>
        <span className="side-meta">
          <span className={`side-open-dot ${isOpen ? 'open' : 'closed'}`} />
          {result.distance.toFixed(2)} km · ★ {rating.toFixed(1)}
        </span>
      </div>
      <div className="side-thumb">
        <img src={thumbImg(result)} alt={result.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
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
  const tabsRef = useRef<HTMLDivElement>(null);

  const [query]          = useState(searchParams.get('query') ?? '');
  const [latitude, setLatitude]   = useState(String(defaultLat));
  const [longitude, setLongitude] = useState(String(defaultLon));
  const [radius]                  = useState(String(defaultRadius));
  const [locationLabel, setLocationLabel] = useState('Mokotów, Warszawa');
  const [results, setResults]   = useState<SearchResult[]>(initialResults);
  const [loading, setLoading]   = useState(false);
  const [locating, setLocating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dark, setDark]         = useState(true);
  const [addressOpen, setAddressOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [weather, setWeather]   = useState<{ temp: number; icon: React.ReactNode; desc: string } | null>(null);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [forecast, setForecast] = useState<{
    hourly: { time: string; temp: number; code: number; rain: number }[];
    daily:  { date: string; max: number; min: number; code: number; rain: number }[];
  } | null>(null);
  const [enabledCats, setEnabledCats] = useState<Set<string>>(DEFAULT_ACTIVE);
  const [personalizujOpen, setPersonalizujOpen] = useState(false);
  const [tabsOverflow, setTabsOverflow] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [now, setNow] = useState(new Date());
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(12);

  const visibleCats = ALL_CATEGORIES.filter(c => enabledCats.has(c.label));

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const check = () => setTabsOverflow(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visibleCats.length]);

  useEffect(() => {
    const th = localStorage.getItem('theme');
    if (th === 'light') setDark(false);
    const cats = localStorage.getItem('enabledCats');
    if (cats) try { setEnabledCats(new Set(JSON.parse(cats))); } catch { /* ignore */ }
    const savedLikes = localStorage.getItem('likes');
    if (savedLikes) try { setLikes(new Set(JSON.parse(savedLikes))); } catch { /* ignore */ }

    // visitors counter persisted in localStorage
    const base = parseInt(localStorage.getItem('visitorBase') ?? '0', 10) || Math.floor(8400 + Math.random() * 1200);
    const v = base + Math.floor(Math.random() * 12);
    localStorage.setItem('visitorBase', String(v));
    setVisitors(v);

    // clock
    const tick = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const lat = parseFloat(latitude), lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) return;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,weathercode`
      + `&hourly=temperature_2m,weathercode,precipitation_probability`
      + `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max`
      + `&timezone=auto&forecast_days=5`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const code = d.current.weathercode as number;
        setWeather({ temp: Math.round(d.current.temperature_2m), icon: weatherIcon(code), desc: weatherDesc(code) });

        // find current hour index
        const nowISO = new Date().toISOString().slice(0, 13);
        const startIdx = (d.hourly.time as string[]).findIndex(t => t.startsWith(nowISO));
        const si = startIdx >= 0 ? startIdx : 0;

        setForecast({
          hourly: (d.hourly.time as string[]).slice(si, si + 12).map((t: string, i: number) => ({
            time: t.slice(11, 16),
            temp: Math.round(d.hourly.temperature_2m[si + i]),
            code: d.hourly.weathercode[si + i],
            rain: d.hourly.precipitation_probability[si + i] ?? 0,
          })),
          daily: (d.daily.time as string[]).map((t: string, i: number) => ({
            date: t,
            max:  Math.round(d.daily.temperature_2m_max[i]),
            min:  Math.round(d.daily.temperature_2m_min[i]),
            code: d.daily.weathercode[i],
            rain: d.daily.precipitation_probability_max[i] ?? 0,
          })),
        });
      }).catch(() => {});
  }, [latitude, longitude]);


  const doSearch = useCallback(async (q: string, lat: string, lon: string, rad: string) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ query: q, latitude: lat, longitude: lon, radius: rad });
      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error();
      setResults((await res.json()).results);
      router.replace(`/?${params}&lang=${locale}`, { scroll: false });
    } catch { setError('Nie udało się pobrać danych. Spróbuj ponownie.'); }
    finally { setLoading(false); }
  }, [locale, router]);

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    doSearch(visibleCats[idx]?.filter ?? '', latitude, longitude, radius);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setAddressOpen(true); return; }
    setLocating(true); setError(null);
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = String(pos.coords.latitude.toFixed(6));
      const lon = String(pos.coords.longitude.toFixed(6));
      setLatitude(lat); setLongitude(lon);
      setLocationLabel(`${parseFloat(lat).toFixed(4)}°N, ${parseFloat(lon).toFixed(4)}°E`);
      setLocating(false);
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pl`, { headers: { 'User-Agent': 'PolkaSearch/1.0' } })
        .then(r => r.json()).then(d => {
          const a = d.address;
          const lbl = [a?.road, a?.suburb ?? a?.neighbourhood, a?.city ?? a?.town].filter(Boolean).join(', ');
          if (lbl) setLocationLabel(lbl);
        }).catch(() => {});
      doSearch(visibleCats[activeTab]?.filter ?? '', lat, lon, radius);
    }, () => { setLocating(false); setAddressOpen(true); }, { timeout: 8000, enableHighAccuracy: true });
  };

  const handleGeocodeAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setLocating(true); setError(null);
    try {
      const params = new URLSearchParams({ q: addressInput, format: 'json', limit: '1', 'accept-language': 'pl' });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { 'User-Agent': 'PolkaSearch/1.0' } });
      const data = await res.json();
      if (!data[0]) throw new Error();
      const lat = String(parseFloat(data[0].lat).toFixed(6));
      const lon = String(parseFloat(data[0].lon).toFixed(6));
      setLatitude(lat); setLongitude(lon);
      setLocationLabel(data[0].display_name.split(',').slice(0, 3).join(',').trim());
      setAddressOpen(false); setAddressInput('');
      doSearch(visibleCats[activeTab]?.filter ?? '', lat, lon, radius);
    } catch { setError('Nie znaleziono podanego adresu.'); }
    finally { setLocating(false); }
  };

  const toggleCat = (label: string, alwaysOn?: boolean) => {
    if (alwaysOn) return;
    setEnabledCats(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      localStorage.setItem('enabledCats', JSON.stringify([...next]));
      return next;
    });
  };

  const switchLang = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    router.push(`/?${params}`);
  };

  const handleLike = (name: string) => {
    setLikes(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      localStorage.setItem('likes', JSON.stringify([...next]));
      return next;
    });
  };

  const isDeals = visibleCats[activeTab]?.isDeals ?? false;

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'rating') return getRating(b.name).rating - getRating(a.name).rating;
    return a.distance - b.distance;
  });
  const filteredResults = filterOpen
    ? sortedResults.filter(r => getOpenStatus(r.name, r.category).isOpen)
    : sortedResults;
  const pagedResults = filteredResults.slice(0, pageSize);

  const hero = pagedResults[0];
  const gridCards = pagedResults.slice(1, 4);
  const sideList = pagedResults.slice(0, 5);
  const bottomCards = pagedResults.slice(4);

  return (
    <>
      <PolkaDotBackground />
      <div className="portal">
        <nav className="top-nav">

          {/* ── Wiersz 1: logo · pogoda · lokalizacja · GPS · theme ── */}
          <div className="nav-row1">
            <a className="nav-logo" href="/">Polka<span>.Search</span></a>

            <div className="nav-location-group">
              {weather && (
                <div className="weather-wrap">
                  <button className="weather-inline" onClick={() => setWeatherOpen(o => !o)}>
                    {weather.icon}
                    <span>{weather.temp}°C</span>
                    <span className="weather-desc-text">{weather.desc}</span>
                  </button>
                  {weatherOpen && forecast && (
                    <div className="weather-panel">
                      <div className="personalize-header">
                        <span>Prognoza pogody</span>
                        <button className="icon-btn" onClick={() => setWeatherOpen(false)}>✕</button>
                      </div>

                      <div className="weather-panel-section-label">Najbliższe godziny</div>
                      <div className="weather-hourly">
                        {forecast.hourly.map((h, i) => (
                          <div key={i} className="weather-hour-cell">
                            <span className="wh-time">{h.time}</span>
                            <span className="wh-icon">{weatherIcon(h.code)}</span>
                            <span className="wh-temp">{h.temp}°</span>
                            {h.rain > 0 && <span className="wh-rain">{h.rain}%</span>}
                          </div>
                        ))}
                      </div>

                      <div className="weather-panel-section-label" style={{ marginTop: 14 }}>Najbliższe dni</div>
                      <div className="weather-daily">
                        {forecast.daily.map((d, i) => (
                          <div key={i} className="weather-day-row">
                            <span className="wd-date">{new Date(d.date).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                            <span className="wd-icon">{weatherIcon(d.code)}</span>
                            <span className="wd-desc">{weatherDesc(d.code)}</span>
                            {d.rain > 0 && <span className="wh-rain">{d.rain}%</span>}
                            <span className="wd-temps"><strong>{d.max}°</strong> / <span style={{color:'var(--text2)'}}>{d.min}°</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button className="locate-mini-btn" onClick={handleGeolocate} disabled={locating} title="Użyj GPS">
                <IconPin /> <span className="locate-label">{locating ? 'Lokalizuję…' : locationLabel}</span>
              </button>
            </div>

            <div className="nav-right">
              <button className="icon-btn" onClick={() => setDark(d => !d)} title="Motyw">{dark ? <IconSun /> : <IconMoon />}</button>
            </div>
          </div>

          <NewsTicker locationLabel={locationLabel} />

          {/* ── Wiersz 2: taby · EN/PL/UK · Personalizuj ── */}
          <div className="nav-row2">
            {tabsOverflow && (
              <button className="tab-scroll-btn" onClick={() => tabsRef.current?.scrollBy({ left: -160, behavior: 'smooth' })}>
                <IconChevronLeft />
              </button>
            )}

            <div className={`nav-tabs-scroll${tabsOverflow ? '' : ' tabs-spread'}`} ref={tabsRef}>
              {visibleCats.map((cat, i) => (
                <button
                  key={cat.label}
                  className={`nav-tab${activeTab === i ? ' active' : ''}${cat.isDeals ? ' deal-tab' : ''}`}
                  onClick={() => handleTabClick(i)}
                >
                  {cat.isDeals ? <><IconDiscount />&nbsp;</> : null}{cat.label}
                </button>
              ))}
            </div>

            {tabsOverflow && (
              <button className="tab-scroll-btn" onClick={() => tabsRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}>
                <IconChevronRight />
              </button>
            )}

            <div className="nav-lang-group">
              {(['en', 'pl', 'uk'] as const).map(lang => (
                <button key={lang} className="lang-pill" onClick={() => switchLang(lang)}>{lang.toUpperCase()}</button>
              ))}
            </div>

            <div className="personalize-wrap">
              <button className="personalize-btn" onClick={() => setPersonalizujOpen(o => !o)}>
                <IconSliders /> <span className="personalize-label">Personalizuj</span>
              </button>
              {personalizujOpen && (
                <div className="personalize-panel">
                  <div className="personalize-header">
                    <span>Wybierz tematy</span>
                    <button className="icon-btn" onClick={() => setPersonalizujOpen(false)}>✕</button>
                  </div>
                  <div className="personalize-grid">
                    {ALL_CATEGORIES.map(cat => (
                      <button
                        key={cat.label}
                        className={`personalize-chip${enabledCats.has(cat.label) ? ' active' : ''}${cat.alwaysOn ? ' locked' : ''}`}
                        onClick={() => toggleCat(cat.label, cat.alwaysOn)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {addressOpen && (
            <form className="search-bar" onSubmit={handleGeocodeAddress}>
              <input autoFocus type="text" value={addressInput} onChange={e => setAddressInput(e.target.value)}
                placeholder="Wpisz adres, ulicę lub miasto…" className="search-input" />
              <button type="submit" className="search-submit" disabled={locating}>{locating ? '…' : 'Szukaj'}</button>
              <button type="button" className="search-submit" disabled={locating} onClick={() => { handleGeolocate(); setAddressOpen(false); }}>
                <IconPin />
              </button>
              <button type="button" className="search-submit" style={{ background:'var(--bg3)', color:'var(--text2)' }} onClick={() => setAddressOpen(false)}>✕</button>
            </form>
          )}
        </nav>

        {error && <div className="error-bar">{error} <button onClick={() => setError(null)}>✕</button></div>}

        <AiSearchBar latitude={latitude} longitude={longitude} locationLabel={locationLabel}
          onSearch={q => doSearch(q, latitude, longitude, radius)} />

        {/* filter bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <button className={`filter-pill${sortBy === 'distance' ? ' active' : ''}`} onClick={() => setSortBy('distance')}>Odległość</button>
            <button className={`filter-pill${sortBy === 'rating' ? ' active' : ''}`} onClick={() => setSortBy('rating')}>Ocena</button>
          </div>
          <div className="filter-sep" />
          <button className={`filter-pill toggle${filterOpen ? ' active' : ''}`} onClick={() => setFilterOpen(o => !o)}>
            <span className={`open-dot-mini ${filterOpen ? 'open' : ''}`} />
            Otwarte teraz
          </button>
          {filteredResults.length !== results.length && (
            <span className="filter-count">{filteredResults.length} z {results.length}</span>
          )}
        </div>

        <main className="portal-main">
          {loading ? (
            <div className="loading-state"><div className="spinner" /><p>Pobieranie danych z okolicy…</p></div>
          ) : filteredResults.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3>Brak wyników</h3>
              <p>{filterOpen ? 'Spróbuj wyłączyć filtr "Otwarte teraz".' : 'Spróbuj zwiększyć promień lub zmień lokalizację.'}</p>
              {filterOpen && <button className="filter-pill active" onClick={() => setFilterOpen(false)}>Pokaż wszystkie</button>}
            </div>
          ) : (
            <>
              <div className="primary-row">
                <div className="primary-left">{hero && <HeroCard result={hero} isDeal={isDeals} onClick={() => setSelectedResult(hero)} liked={likes.has(hero.name)} onLike={() => handleLike(hero.name)} />}</div>
                <aside className="primary-side">
                  <h3 className="side-heading">Najlepsze w pobliżu</h3>
                  <div className="side-list-wrap">
                    {sideList.map((r, i) => <SideListCard key={i} result={r} rank={i + 1} onClick={() => setSelectedResult(r)} />)}
                  </div>
                </aside>
              </div>
              {gridCards.length > 0 && <div className="grid-row">{gridCards.map((r, i) => <GridCard key={i} result={r} isDeal={isDeals} onClick={() => setSelectedResult(r)} liked={likes.has(r.name)} onLike={() => handleLike(r.name)} />)}</div>}
              {bottomCards.length > 0 && <div className="grid-row">{bottomCards.map((r, i) => <GridCard key={i} result={r} isDeal={isDeals} onClick={() => setSelectedResult(r)} liked={likes.has(r.name)} onLike={() => handleLike(r.name)} />)}</div>}
              {pagedResults.length < filteredResults.length && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <button className="load-more-btn" onClick={() => setPageSize(p => p + 12)}>
                    Załaduj więcej ({filteredResults.length - pagedResults.length} pozostałych)
                  </button>
                </div>
              )}
            </>
          )}
          <section className="updates-section">
            <h3 className="section-heading">Aktualności od lokalnych firm</h3>
            <div className="updates-grid">{initialUpdates.map((u, i) => <UpdateCard key={i} update={u} />)}</div>
          </section>
        </main>

        {selectedResult && (
          <DetailModal
            result={selectedResult}
            onClose={() => setSelectedResult(null)}
            onLike={handleLike}
            liked={likes.has(selectedResult.name)}
          />
        )}

        <footer className="site-footer">
          <div className="footer-inner">
            <span className="footer-item">
              <IconSearch16 /> {loading ? '…' : `${results.length} wyników`}
            </span>
            <span className="footer-sep">·</span>
            <span className="footer-item">
              <IconUsers /> {visitors.toLocaleString('pl-PL')} odwiedzających
            </span>
            <span className="footer-sep">·</span>
            <span className="footer-item">
              <IconPin /> promień {radius} km
            </span>
            <span className="footer-sep">·</span>
            <span className="footer-item footer-time">
              {now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              &nbsp;
              {now.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span className="footer-sep footer-right-sep">·</span>
            <span className="footer-item footer-attr">
              Dane: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · <a href="https://wikipedia.org" target="_blank" rel="noopener">Wikipedia</a>
            </span>
            <span className="footer-sep">·</span>
            <button className="footer-feedback-btn" onClick={() => setFeedbackOpen(true)}>
              Opinie
            </button>
          </div>
        </footer>
      </div>
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </>
  );
}
