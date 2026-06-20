'use client';
import { useState } from 'react';

interface Props {
  latitude: string;
  longitude: string;
  locationLabel: string;
  onSearch: (query: string) => void;
}

export default function AiSearchBar({ onSearch }: Props) {
  const [input, setInput] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (q) onSearch(q);
  };

  return (
    <div className="aisb-wrap">
      <form className="aisb-bar" onSubmit={submit}>
        <svg className="aisb-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="aisb-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Wyszukaj miejsca w pobliżu…"
          autoComplete="off"
        />
        <button type="submit" className="aisb-ai-btn" disabled={!input.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
