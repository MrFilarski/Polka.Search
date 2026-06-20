'use client';
import { useState, useRef } from 'react';

interface Props {
  latitude: string;
  longitude: string;
  locationLabel: string;
  onSearch: (query: string) => void;
}

function BielikIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}

export default function AiSearchBar({ latitude, longitude, locationLabel, onSearch }: Props) {
  const [input, setInput]   = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey]  = useState(true);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;

    setAnswer('');
    setLoading(true);
    onSearch(q);

    try {
      const res = await fetch('/api/bielik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, lat: latitude, lon: longitude, locationLabel }),
      });

      if (res.status === 503) { setHasKey(false); setLoading(false); return; }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const d = line.slice(6).trim();
          if (d === '[DONE]') break;
          try { full += JSON.parse(d)?.choices?.[0]?.delta?.content ?? ''; setAnswer(full); } catch { /* skip */ }
        }
      }
    } catch {
      setAnswer('Nie udało się połączyć z Bielik AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aisb-wrap">
      <form className={`aisb-bar${focused ? ' aisb-focused' : ''}`} onSubmit={submit}>
        {/* left search icon */}
        <svg className="aisb-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          ref={inputRef}
          className="aisb-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Wyszukaj miejsca, zapytaj Bielik AI…"
          disabled={loading}
          autoComplete="off"
        />

        {loading && <span className="aisb-spinner" />}

        {/* right Bielik icon — clicking it submits */}
        <button type="submit" className="aisb-ai-btn" title="Zapytaj Bielik AI" disabled={loading} style={{ color: 'var(--accent)' }}>
          <BielikIcon />
        </button>
      </form>

      {/* dropdown result */}
      {(answer || (!hasKey && input)) && (
        <div className="aisb-dropdown">
          {!hasKey ? (
            <p className="aisb-no-key">
              Dodaj <code>BIELIK_API_KEY</code> do <code>.env.local</code>.
              Klucz dostępny na <strong>bielik.ai</strong>.
            </p>
          ) : (
            <>
              <div className="aisb-answer-header" style={{ color: 'var(--accent)' }}>
                <BielikIcon />
                <span>Bielik AI</span>
              </div>
              <p className="aisb-answer-text">{answer}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
