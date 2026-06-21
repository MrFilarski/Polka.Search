'use client';
import { useEffect, useState } from 'react';
import { adminFetch } from './adminFetch';

interface ApiStatus { name: string; url: string; status: 'ok' | 'error' | 'checking' }
interface Deployment { env: string; region: string; gitBranch: string; gitCommit: string; deployedAt: string }

export default function AdminSystem() {
  const [apis, setApis] = useState<ApiStatus[]>([
    { name: 'Overpass API', url: 'overpass-api.de', status: 'checking' },
    { name: 'Open-Meteo', url: 'api.open-meteo.com', status: 'checking' },
    { name: 'Nominatim OSM', url: 'nominatim.openstreetmap.org', status: 'checking' },
    { name: 'Wikipedia API', url: 'pl.wikipedia.org', status: 'checking' },
    { name: 'Google News RSS', url: 'news.google.com', status: 'checking' },
  ]);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const check = () => {
    setLoading(true);
    adminFetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setApis(d.apis);
        setDeployment(d.deployment);
        setLastCheck(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { check(); }, []);

  const allOk = apis.every(a => a.status === 'ok');

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-h1">Status systemu</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastCheck && <span style={{ color: '#666', fontSize: '0.8rem' }}>Sprawdzono: {lastCheck.toLocaleTimeString('pl-PL')}</span>}
          <button className="admin-refresh-btn" onClick={check} disabled={loading}>
            {loading ? '⟳ Sprawdzam…' : '↺ Odśwież'}
          </button>
        </div>
      </div>

      {/* Overall status */}
      <div className={`admin-status-banner${allOk ? ' ok' : ' warn'}`}>
        <span style={{ fontSize: 24 }}>{allOk ? '✅' : '⚠️'}</span>
        <div>
          <strong>{allOk ? 'Wszystkie systemy działają' : 'Wykryto problemy z API'}</strong>
          <div style={{ fontSize: '0.82rem', marginTop: 2, opacity: 0.7 }}>
            {apis.filter(a => a.status === 'ok').length} z {apis.length} API online
          </div>
        </div>
      </div>

      {/* API status cards */}
      <div className="admin-section-title">Zewnętrzne API</div>
      <div className="asystem-grid">
        {apis.map((api, i) => (
          <div key={i} className={`asystem-card ${api.status}`}>
            <div className="asystem-dot" />
            <div>
              <div className="asystem-name">{api.name}</div>
              <div className="asystem-url">{api.url}</div>
            </div>
            <div className={`asystem-status-label ${api.status}`}>
              {api.status === 'checking' ? '…' : api.status === 'ok' ? 'Online' : 'Error'}
            </div>
          </div>
        ))}
      </div>

      {/* Deployment info */}
      {deployment && (
        <>
          <div className="admin-section-title" style={{ marginTop: 28 }}>Deployment</div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <tbody>
                <tr><td>Środowisko</td><td><span className={`admin-badge ${deployment.env === 'production' ? 'green' : ''}`}>{deployment.env}</span></td></tr>
                <tr><td>Region</td><td style={{ color: '#ccc' }}>{deployment.region}</td></tr>
                <tr><td>Branch</td><td><code style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{deployment.gitBranch}</code></td></tr>
                <tr><td>Commit</td><td><code style={{ color: '#6366f1', fontSize: '0.85rem' }}>{deployment.gitCommit}</code></td></tr>
                <tr><td>Opis</td><td style={{ color: '#888', fontSize: '0.82rem' }}>{deployment.deployedAt}</td></tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tech stack */}
      <div className="admin-section-title" style={{ marginTop: 28 }}>Stack technologiczny</div>
      <div className="asystem-grid">
        {[
          { name: 'Next.js', ver: '16.x', icon: '▲', color: '#fff' },
          { name: 'TypeScript', ver: 'strict', icon: 'TS', color: '#3b82f6' },
          { name: 'Tailwind CSS', ver: 'v4', icon: '💨', color: '#06b6d4' },
          { name: 'Recharts', ver: '2.x', icon: '📊', color: '#6366f1' },
          { name: 'Vercel', ver: 'Edge', icon: '▲', color: '#fff' },
          { name: 'Overpass API', ver: 'OSM', icon: '🗺️', color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="asystem-card ok" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              <strong style={{ color: s.color }}>{s.name}</strong>
            </div>
            <span style={{ color: '#666', fontSize: '0.78rem' }}>{s.ver}</span>
          </div>
        ))}
      </div>

      <div className="admin-info-box" style={{ marginTop: 28 }}>
        <strong>💡 Roadmap:</strong> Supabase (auth + DB) · Ticketmaster API key · Wikimedia photos · Feedback backend · Bielik AI
      </div>
    </div>
  );
}
