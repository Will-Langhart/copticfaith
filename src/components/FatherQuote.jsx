import { useState } from 'react';

/**
 * Collapsible Church Father quote block.
 * Shows first ~3 lines collapsed; expands on toggle.
 * Always fully visible in print (see print.css).
 */
export default function FatherQuote({ author, work, year, children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`father-quote father-quote--collapsible ${expanded ? 'father-quote--expanded' : ''}`}>
      {(author || work) && (
        <span className="ref">
          {author}{work ? `, ${work}` : ''}{year ? ` (${year})` : ''}
        </span>
      )}
      <div className="father-quote-body">
        {children}
      </div>
      <button
        className="father-quote-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse quote' : 'Expand full quote'}
      >
        {expanded ? '▲ Collapse' : '▼ Show full quote'}
      </button>
    </div>
  );
}
