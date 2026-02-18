export default function NavOverlay({ isOpen, sections, activeId, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="nav-overlay" role="dialog" aria-label="Section navigation">
      <button
        className="nav-overlay__close"
        onClick={onClose}
        aria-label="Close navigation"
      >
        ×
      </button>
      <nav className="nav-overlay__nav">
        {sections.map(({ id, title }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-overlay__link ${activeId === id ? 'nav-overlay__link--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(id);
            }}
          >
            {title}
          </a>
        ))}
      </nav>
    </div>
  );
}
