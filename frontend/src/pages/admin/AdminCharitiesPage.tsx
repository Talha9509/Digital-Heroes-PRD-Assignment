
import { useEffect, useState } from 'react';
import type {FormEvent} from 'react'
import { api } from '../../api/client';

interface Charity {
  id: string;
  name: string;
  description: string;
  websiteUrl?: string;
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const load = () => {
    api.get<Charity[]>('/charities').then(setCharities).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post('/admin/charities', {
      name,
      description: desc,
    });
    setName('');
    setDesc('');
    load();
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Charities
        </h1>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ marginTop: '0.5rem' }}>
            <label className="input-label">Description</label>
            <textarea
              className="input-field"
              style={{ minHeight: 80 }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <button
            className="primary-button"
            style={{ marginTop: '0.7rem' }}
          >
            Add charity
          </button>
        </form>
      </div>

      <div className="card">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {charities.map((c) => (
            <li
              key={c.id}
              style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <strong>{c.name}</strong>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                {c.description}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}