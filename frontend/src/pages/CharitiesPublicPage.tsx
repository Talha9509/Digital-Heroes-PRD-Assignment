import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Charity {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
}

export default function CharitiesPublicPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Charity[]>('/charities')
      .then(setCharities)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center">Loading charities...</div>;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <h1>Charities we support</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
        Every subscription channels a guaranteed percentage toward
        organisations that move the needle in health, youth and
        community development.[file:1]
      </p>
      <div
        style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {charities.map((c) => (
          <article key={c.id} className="card">
            <h2 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>
              {c.name}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {c.description}
            </p>
            {c.websiteUrl && (
              <a
                href={c.websiteUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.6rem',
                  fontSize: '0.85rem',
                  color: 'var(--accent-alt)',
                }}
              >
                Visit site ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}