'use client';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { adminFetch } from './adminFetch';

interface Stats {
  kpi: { todayVisitors: number; weekVisitors: number; monthVisitors: number; change: number; totalPlaces: number; activeUsers: number };
  visitorHistory: { date: string; visitors: number }[];
  hourlyActivity: { hour: string; sessions: number }[];
  tabPopularity: { name: string; clicks: number }[];
}

const PIE_COLORS = ['#e8003d', '#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

function KpiCard({ label, value, sub, color = '#e8003d' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="akpi-card">
      <div className="akpi-label">{label}</div>
      <div className="akpi-value" style={{ color }}>{value}</div>
      {sub && <div className="akpi-sub">{sub}</div>}
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" />Ładowanie danych…</div>;
  if (!stats) return <div className="admin-error">Błąd ładowania danych</div>;

  const { kpi, visitorHistory, hourlyActivity, tabPopularity } = stats;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-h1">Analytics</h1>
        <span className="admin-badge green">● Live</span>
      </div>

      <div className="akpi-grid">
        <KpiCard label="Dziś" value={kpi.todayVisitors.toLocaleString('pl-PL')}
          sub={`${kpi.change > 0 ? '↑' : '↓'} ${Math.abs(kpi.change)}% vs wczoraj`}
          color={kpi.change >= 0 ? '#10b981' : '#f87171'} />
        <KpiCard label="Ten tydzień" value={kpi.weekVisitors.toLocaleString('pl-PL')} sub="ostatnie 7 dni" color="#fff" />
        <KpiCard label="Ten miesiąc" value={kpi.monthVisitors.toLocaleString('pl-PL')} sub="ostatnie 30 dni" color="#6366f1" />
        <KpiCard label="Miejsca w DB" value={kpi.totalPlaces} sub="z Overpass API" color="#f59e0b" />
        <KpiCard label="Konta użytk." value={kpi.activeUsers} sub="localStorage" color="#8b5cf6" />
      </div>

      <div className="acharts-row">
        <div className="achart-card" style={{ flex: 2 }}>
          <h3 className="achart-title">Odwiedzający — ostatnie 30 dni</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={visitorHistory} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8003d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e8003d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
              <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid #222', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="visitors" stroke="#e8003d" strokeWidth={2} fill="url(#visGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="achart-card" style={{ flex: 1 }}>
          <h3 className="achart-title">Popularność zakładek</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={tabPopularity} dataKey="clicks" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                label={false}
                labelLine={false} fontSize={10}>
                {tabPopularity.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid #222', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="achart-card">
        <h3 className="achart-title">Aktywność w ciągu dnia (sesje / godzinę)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hourlyActivity} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} interval={2} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#111118', border: '1px solid #222', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Bar dataKey="sessions" fill="#6366f1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
