import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SITE, resolveMeta } from '../data/seoMeta';

// Update an existing <meta> tag's content by name or property, creating
// it if missing. Editing in place (rather than rendering new tags) keeps
// a single source of truth and avoids duplicate/conflicting head tags.
function setMeta(selector, attr, key, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Add or remove <meta name="robots" content="noindex">.
function setNoindex(noindex) {
  const el = document.head.querySelector('meta[name="robots"]');
  if (noindex) {
    setMeta('meta[name="robots"]', 'name', 'robots', 'noindex');
  } else if (el) {
    el.remove();
  }
}

/**
 * Root layout for every route. Keeps document metadata in sync with the
 * current path so JS-rendering crawlers and browser tabs get accurate,
 * per-page titles, descriptions, and Open Graph / Twitter cards.
 */
export default function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description, canonical, noindex } = resolveMeta(pathname);

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setCanonical(canonical);
    setNoindex(noindex);

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', SITE.ogImage);

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }, [pathname]);

  return <Outlet />;
}
