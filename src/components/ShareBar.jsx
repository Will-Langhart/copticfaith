import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShareBar({ sectionId, sectionTitle }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/#${sectionId}`;
  const text = `"${sectionTitle}" — The Ancient Faith: Once Delivered to the Saints`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a temp input
      const inp = document.createElement('input');
      inp.value = url;
      document.body.appendChild(inp);
      inp.select();
      document.execCommand('copy');
      document.body.removeChild(inp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: sectionTitle, text, url });
      } catch { /* user cancelled */ }
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="share-bar" aria-label="Share this section">
      <button
        className="share-bar__btn"
        onClick={copyLink}
        title={t('share.copy_link')}
        aria-label={t('share.copy_link')}
      >
        {copied ? t('share.copied') : t('share.copy_link')}
      </button>

      {'share' in navigator && (
        <button
          className="share-bar__btn"
          onClick={share}
          title={t('share.share')}
          aria-label={t('share.share')}
        >
          {t('share.share')}
        </button>
      )}

      <a
        className="share-bar__btn share-bar__btn--link"
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={t('share.share_on_x')}
        aria-label={t('share.share_on_x')}
      >
        {t('share.share_on_x')}
      </a>
    </div>
  );
}
