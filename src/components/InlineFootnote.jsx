import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

let noteCounter = 0;

/**
 * Inline footnote — superscript [n] that opens a popover on click.
 * The popover is portalled to document.body to avoid clipping.
 */
export default function InlineFootnote({ children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const idRef = useRef(null);
  if (!idRef.current) {
    noteCounter += 1;
    idRef.current = noteCounter;
  }
  const n = idRef.current;

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY + 6;
      let left = rect.left + window.scrollX;
      // Keep popover within viewport
      const maxLeft = window.innerWidth - 320 - 16;
      left = Math.min(Math.max(left, 16), maxLeft);
      setPos({ top, left });
    }
    setOpen(o => !o);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!btnRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const popover = open
    ? createPortal(
        <div
          className="footnote-popover"
          role="tooltip"
          id={`fn-${n}-popover`}
          style={{ top: pos.top, left: pos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="footnote-popover__close"
            onClick={() => setOpen(false)}
            aria-label="Close footnote"
          >
            ×
          </button>
          <div className="footnote-popover__body">{children}</div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        className="footnote-anchor"
        onClick={toggle}
        aria-label={`Footnote ${n}`}
        aria-expanded={open}
        aria-controls={`fn-${n}-popover`}
      >
        [{n}]
      </button>
      {popover}
    </>
  );
}
