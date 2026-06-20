import type { SearchResult } from '@/lib/types';
import type { Translations } from '@/lib/i18n';

export default function ResultCard({ result, t }: { result: SearchResult; t: Translations }) {
  return (
    <div className="result-item">
      <span className="result-label">{result.type}</span>
      <h3>{result.name}</h3>
      <p className="result-category">{result.category}</p>
      <p>{result.description}</p>
      <div className="result-info">
        <span>{result.address}</span>
        <span>{t.distance} {result.distance.toFixed(1)} km</span>
        {result.eventDate && (
          <span>{t.starts} {new Date(result.eventDate).toLocaleString()}</span>
        )}
      </div>
      <div className="result-tags">
        {result.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}
