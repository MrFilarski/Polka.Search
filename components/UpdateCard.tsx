import type { BusinessUpdate } from '@/lib/types';
import type { Translations } from '@/lib/i18n';

export default function UpdateCard({ update, t }: { update: BusinessUpdate; t: Translations }) {
  const time = new Date(update.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="update-card">
      <div className="update-header">
        <div className="update-business">
          <span className="update-icon">{update.icon}</span>
          <div className="update-meta">
            <h4>{update.businessName}</h4>
            <p className="update-category">{update.category}</p>
          </div>
        </div>
        <span className="update-type">{t.updateTypes[update.updateType]}</span>
      </div>
      <p className="update-content">{update.content}</p>
      <div className="update-footer">
        <span className="update-time">{t.posted(time)}</span>
        <span className="update-likes">❤️ {update.likes}</span>
      </div>
    </div>
  );
}
