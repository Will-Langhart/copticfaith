import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavOverlay from '../components/NavOverlay';
import SideDots from '../components/SideDots';
import ProgressBar from '../components/ProgressBar';
import SectionNav from '../components/SectionNav';
import ShareBar from '../components/ShareBar';
import TableOfContents from '../components/TableOfContents';
import SearchModal from '../components/SearchModal';
import { SECTIONS } from '../data/sectionMeta';

// Lazy-load section components (hero is inline, not lazy)
const Section1  = lazy(() => import('../sections/Section1'));
const Section2  = lazy(() => import('../sections/Section2'));
const Section3  = lazy(() => import('../sections/Section3'));
const Section4  = lazy(() => import('../sections/Section4'));
const Section5  = lazy(() => import('../sections/Section5'));
const Section6  = lazy(() => import('../sections/Section6'));
const Section7  = lazy(() => import('../sections/Section7'));
const Section8  = lazy(() => import('../sections/Section8'));
const Section9  = lazy(() => import('../sections/Section9'));
const Section10 = lazy(() => import('../sections/Section10'));
const Section11 = lazy(() => import('../sections/Section11'));

// Map sectionId → component
const SECTION_COMPONENTS = {
  note:       Section1,
  foundation: Section2,
  historical: Section3,
  doctrines:  Section4,
  eucharist:  Section5,
  mysteries:  Section6,
  fasting:    Section7,
  saints:     Section8,
  types:      Section9,
  liturgy:    Section10,
  conclusion: Section11,
};

function SectionSkeleton() {
  return <div className="section-skeleton" aria-hidden="true" />;
}

export default function MainPage() {
  const { t } = useTranslation();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [navOpen, setNavOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const scrollTo = useCallback((id) => {
    setNavOpen(false);
    setTocOpen(false);
    setSearchOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 72;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  // Scroll to hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => scrollTo(hash), 100);
  }, [scrollTo]);

  // Scroll tracking
  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const y = window.scrollY;
        setHeaderVisible(y > 120);
        const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
        for (let i = sectionEls.length - 1; i >= 0; i--) {
          const rect = sectionEls[i].getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(SECTIONS[i].id);
            // Update URL hash silently
            const hash = `#${SECTIONS[i].id}`;
            if (window.location.hash !== hash) {
              history.replaceState(null, '', hash);
            }
            break;
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Cmd+K / Ctrl+K shortcut for search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Content sections (all except hero)
  const contentSections = SECTIONS.filter(s => s.id !== 'hero');

  return (
    <div className="app">
      <ProgressBar />

      <Header
        visible={headerVisible}
        sections={SECTIONS}
        activeId={activeSection}
        onNavigateClick={() => setNavOpen(true)}
        onSelect={scrollTo}
        onSearchClick={() => setSearchOpen(true)}
        onTocClick={() => setTocOpen(true)}
      />

      <NavOverlay
        isOpen={navOpen}
        sections={SECTIONS}
        activeId={activeSection}
        onClose={() => setNavOpen(false)}
        onSelect={scrollTo}
      />

      <TableOfContents
        isOpen={tocOpen}
        sections={SECTIONS}
        activeId={activeSection}
        onClose={() => setTocOpen(false)}
        onSelect={scrollTo}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={scrollTo}
      />

      <SideDots sections={SECTIONS} activeId={activeSection} onSelect={scrollTo} />

      {/* Hero section — not lazy loaded (above the fold) */}
      <section id="hero" className="hero">
        <p className="hero__star">✦</p>
        <h1 className="hero__title">THE ANCIENT FAITH</h1>
        <p className="hero__subtitle">ONCE DELIVERED TO THE SAINTS</p>
        <p className="hero__tagline">
          Building the Biblical and Historical Case for Coptic Orthodoxy<br />
          A Resource Prepared for Protestant Readers<br />
          Drawing on Scripture, Protestant Scholarship, and Primary Historical Sources
        </p>
        <blockquote className="hero__scripture">
          "Contend earnestly for the faith which was once for all delivered to the saints."<br />— Jude 1:3 (NKJV)
        </blockquote>
        <a href="#note" className="hero__btn" onClick={(e) => { e.preventDefault(); scrollTo('note'); }}>
          {t('hero.begin')}
        </a>

        <div className="hero__tools">
          <button className="hero__tool-btn" onClick={() => window.print()} title={t('print.button')}>
            🖨 {t('print.button')}
          </button>
        </div>
      </section>

      {/* Content sections — lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        {contentSections.map((section, i) => {
          const SectionComponent = SECTION_COMPONENTS[section.id];
          const overallIndex = SECTIONS.findIndex(s => s.id === section.id);
          if (!SectionComponent) return null;

          return (
            <section key={section.id} id={section.id} className="section">
              <div className="section__inner">
                <SectionComponent />
                <div className="section__footer">
                  <ShareBar sectionId={section.id} sectionTitle={section.title} />
                  <SectionNav
                    sections={SECTIONS}
                    currentIndex={overallIndex}
                    onSelect={scrollTo}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </Suspense>
    </div>
  );
}
