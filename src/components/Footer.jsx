import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <p className="site-footer__blessing">{t('footer.text')}</p>
        <nav className="site-footer__nav" aria-label="Footer navigation">
          <Link to="/" className="site-footer__link">{t('footer.home')}</Link>
          <Link to="/reading-list" className="site-footer__link">{t('header.reading_list')}</Link>
          <Link to="/faq" className="site-footer__link">{t('header.faq')}</Link>
          <Link to="/glossary" className="site-footer__link">{t('header.glossary')}</Link>
          <Link to="/contact" className="site-footer__link">{t('header.contact')}</Link>
        </nav>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {t('site_title')}
        </p>
      </div>
    </footer>
  );
}
