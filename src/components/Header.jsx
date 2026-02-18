export default function Header({ visible, onNavigateClick }) {
  return (
    <header
      className={`header ${visible ? 'header--visible' : ''}`}
      role="banner"
    >
      <a href="#hero" className="header__logo" onClick={(e) => { e.preventDefault(); onNavigateClick?.(); }}>
        <span className="header__logo-mark">✦</span>
        <span className="header__logo-text">The Ancient Faith</span>
      </a>
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
