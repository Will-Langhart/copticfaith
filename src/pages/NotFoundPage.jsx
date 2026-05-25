import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

export default function NotFoundPage() {
  return (
    <PageShell>
      <div className="page-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p className="hero__star" aria-hidden>✦</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" style={{ color: 'var(--color-gold)' }}>← Return to The Ancient Faith</Link>
      </div>
    </PageShell>
  );
}
