import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NavOverlay from './components/NavOverlay';
import SideDots from './components/SideDots';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';
import Section9 from './sections/Section9';
import Section10 from './sections/Section10';
import Section11 from './sections/Section11';
import './App.css';

const SECTIONS = [
  { id: 'hero', title: 'Home' },
  { id: 'note', title: 'A Note to the Protestant Reader' },
  { id: 'foundation', title: 'Part One: Biblical Foundation' },
  { id: 'historical', title: 'Part Two: Historical Evidence' },
  { id: 'doctrines', title: 'Part Three: The Doctrines' },
  { id: 'eucharist', title: 'Part Four: Holy Eucharist' },
  { id: 'mysteries', title: 'Part Five: Seven Holy Mysteries' },
  { id: 'fasting', title: 'Part Six: Fasting' },
  { id: 'saints', title: 'Part Seven: Intercession of Saints' },
  { id: 'types', title: 'Parts Eight & Nine: OT Types & Monasticism' },
  { id: 'liturgy', title: 'Parts Ten & Eleven: Liturgy & Unbroken Chain' },
  { id: 'conclusion', title: 'Conclusion & Appendices' },
];

function App() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [navOpen, setNavOpen] = useState(false);

  const scrollTo = useCallback((id) => {
    setNavOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 72;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

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

  return (
    <div className="app">
      <Header
        visible={headerVisible}
        sections={SECTIONS}
        activeId={activeSection}
        onNavigateClick={() => setNavOpen(true)}
        onSelect={scrollTo}
      />
      <NavOverlay
        isOpen={navOpen}
        sections={SECTIONS}
        activeId={activeSection}
        onClose={() => setNavOpen(false)}
        onSelect={scrollTo}
      />
      <SideDots sections={SECTIONS} activeId={activeSection} onSelect={scrollTo} />

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
          Begin Reading
        </a>
      </section>

      <section id="note" className="section">
        <div className="section__inner">
          <Section1 />
        </div>
      </section>

      <section id="foundation" className="section">
        <div className="section__inner">
          <Section2 />
        </div>
      </section>

      <section id="historical" className="section">
        <div className="section__inner">
          <Section3 />
        </div>
      </section>

      <section id="doctrines" className="section">
        <div className="section__inner">
          <Section4 />
        </div>
      </section>

      <section id="eucharist" className="section">
        <div className="section__inner">
          <Section5 />
        </div>
      </section>

      <section id="mysteries" className="section">
        <div className="section__inner">
          <Section6 />
        </div>
      </section>

      <section id="fasting" className="section">
        <div className="section__inner">
          <Section7 />
        </div>
      </section>

      <section id="saints" className="section">
        <div className="section__inner">
          <Section8 />
        </div>
      </section>

      <section id="types" className="section">
        <div className="section__inner">
          <Section9 />
        </div>
      </section>

      <section id="liturgy" className="section">
        <div className="section__inner">
          <Section10 />
        </div>
      </section>

      <section id="conclusion" className="section">
        <div className="section__inner">
          <Section11 />
        </div>
      </section>
    </div>
  );
}

export default App;
