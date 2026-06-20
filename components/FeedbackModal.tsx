'use client';
import { useState } from 'react';
import { IconClose } from './Icons';

const CATEGORIES = [
  'Błąd / problem techniczny',
  'Brakujące miejsce lub dane',
  'Złe zdjęcie lub opis',
  'Propozycja nowej funkcji',
  'Ogólna opinia',
];

interface Props { onClose: () => void; }

export default function FeedbackModal({ onClose }: Props) {
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [withEmail, setWithEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !text.trim()) return;
    setLoading(true);
    // store locally (no backend yet)
    const entries = JSON.parse(localStorage.getItem('feedback') ?? '[]');
    entries.push({ category, text, email: withEmail ? email : null, at: new Date().toISOString() });
    localStorage.setItem('feedback', JSON.stringify(entries));
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="feedback-backdrop" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        <button className="feedback-close" onClick={onClose}><IconClose /></button>

        {sent ? (
          <div className="feedback-thanks">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <h3>Dziękujemy za opinię!</h3>
            <p>Twoja opinia pomoże nam udoskonalić Polka.Search.</p>
            <button className="feedback-submit" onClick={onClose}>Zamknij</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="feedback-title">Pomóż nam udoskonalić aplikację!</h3>

            <label className="feedback-label">
              Kategoria opinii <span style={{color:'var(--accent)'}}>*</span>
            </label>
            <select
              className="feedback-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Wybierz kategorię</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="feedback-label">
              Twoja opinia <span style={{color:'var(--accent)'}}>*</span>
            </label>
            <textarea
              className="feedback-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Wpisz tutaj swoją opinię. Aby chronić swoją prywatność, nie podawaj informacji osobistych."
              rows={5}
              required
            />

            <label className="feedback-checkbox-row">
              <input type="checkbox" checked={withEmail} onChange={e => setWithEmail(e.target.checked)} />
              <span>Dołącz adres e-mail</span>
            </label>

            {withEmail && (
              <>
                <label className="feedback-label">Adres e-mail</label>
                <input
                  type="email"
                  className="feedback-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Wprowadź prawidłowy adres e-mail"
                />
              </>
            )}

            <p className="feedback-disclaimer">
              Twoja opinia będzie używana w celu ulepszania Polka.Search.
            </p>

            <div className="feedback-actions">
              <button type="button" className="feedback-cancel" onClick={onClose}>Zamknij</button>
              <button type="submit" className="feedback-submit" disabled={loading || !category || !text.trim()}>
                {loading ? '…' : 'Wyślij'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
