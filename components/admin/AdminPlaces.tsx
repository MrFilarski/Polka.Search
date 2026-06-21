'use client';
import { useEffect, useState } from 'react';

interface Place {
  name: string; category: string; address: string; distance: number; lat: number; lon: number; tags: string[];
}

export default function AdminPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'distance' | 'category'>('distance');
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  useEffect(() => {
    fetch('/api/search?latitude=52.1741&longitude=20.9962&radius=2')
      .then(r => r.json())
      .then(d => setPlaces(d.results ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = places
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'distance' ? a.distance - b.distance : sort === 'name' ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category));

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const pages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-h1">Miejsca</h1>
        <span className="admin-badge">{filtered.length} wyników</span>
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" placeholder="🔍  Szukaj miejsca, kategorii…" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        <div className="admin-sort-group">
          {(['distance', 'name', 'category'] as const).map(s => (
            <button key={s} className={`admin-sort-btn${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>
              {s === 'distance' ? 'Odległość' : s === 'name' ? 'Nazwa' : 'Kategoria'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" />Pobieranie z Overpass API…</div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Kategoria</th>
                  <th>Adres</th>
                  <th>Odległość</th>
                  <th>Tagi</th>
                  <th>Mapa</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p, i) => (
                  <tr key={i}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="admin-cat-badge">{p.category}</span></td>
                    <td style={{ color: '#888', fontSize: '0.82rem' }}>{p.address}</td>
                    <td style={{ color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>{p.distance.toFixed(2)} km</td>
                    <td>
                      {p.tags?.slice(0, 3).map((t, j) => <span key={j} className="admin-tag">{t}</span>)}
                    </td>
                    <td>
                      <a href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`}
                        target="_blank" rel="noopener" className="admin-link">OSM ↗</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="admin-pagination">
              <button className="admin-pg-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Poprzednia</button>
              <span style={{ color: '#666', fontSize: '0.85rem' }}>Strona {page + 1} z {pages}</span>
              <button className="admin-pg-btn" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Następna →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
