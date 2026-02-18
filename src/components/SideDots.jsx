export default function SideDots({ sections, activeId, onSelect }) {
  return (
    <aside className="side-dots" aria-label="Section navigation">
      {sections.map(({ id }, i) => (
        <a
          key={id}
          href={`#${id}`}
          className={`side-dots__dot ${activeId === id ? 'side-dots__dot--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect(id);
          }}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </aside>
  );
}
