const SHORT_LABELS = {
  hero: 'Home',
  note: 'Note',
  foundation: 'Biblical',
  historical: 'History',
  doctrines: 'Doctrines',
  eucharist: 'Eucharist',
  mysteries: 'Mysteries',
  fasting: 'Fasting',
  saints: 'Saints',
  types: 'Types',
  liturgy: 'Liturgy',
  conclusion: 'Conclusion',
};

export default function Header({ visible, sections = [], activeId, onNavigateClick, onSelect }) {
  const handleNavClick = (e, id) => {
    e.preventDefault();
    onSelect?.(id);
  };

  return (
    <header
      className={`header ${visible ? 'header--visible' : ''}`}
      role="banner"
    >
      <a
        href="#hero"
        className="header__logo"
        onClick={(e) => handleNavClick(e, 'hero')}
        aria-label="The Ancient Faith – Home"
      >
        <span className="header__logo-svg" aria-hidden>
          <img src="/logo.png" alt="" width="32" height="32" />
        </span>
        <span className="header__logo-text">The Ancient Faith</span>
      </a>

      <nav className="header__nav" aria-label="Section navigation">
        <ul className="header__nav-list">
          {sections.map(({ id, title }) => (
            <li key={id} className="header__nav-item">
              <a
                href={`#${id}`}
                className={`header__nav-link ${activeId === id ? 'header__nav-link--active' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
                title={title}
              >
                {SHORT_LABELS[id] ?? title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className="header__menu-btn"
        onClick={onNavigateClick}
        aria-label="Open navigation menu"
      >
        <span className="header__menu-icon" />
        <span className="header__menu-icon" />
        <span className="header__menu-icon" />
      </button>
    </header>
  );
}
