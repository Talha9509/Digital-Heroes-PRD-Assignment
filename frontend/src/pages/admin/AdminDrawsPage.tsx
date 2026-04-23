
import { useEffect, useState } from 'react';
import type {FormEvent} from 'react'
import { api } from '../../api/client';

interface Draw {
  id: string;
  year: number;
  month: number;
  drawnNumbers: number[];
  prizePoolTotal: number;
  jackpotPool: number;
  winners: { id: string }[];
}

interface SimResult {
  drawnNumbers?: number[];
}

export default function AdminDrawsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [draws, setDraws] = useState<Draw[]>([]);

  const load = () => {
    api.get<Draw[]>('/draws').then(setDraws).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const onSimulate = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post<SimResult>('/draws/simulate', {
      year,
      month,
      algorithmic: false,
    });
    setSimResult(res);
  };

  const onPublish = async () => {
    await api.post('/draws/publish', {
      year,
      month,
      algorithmic: false,
    });
    setSimResult(null);
    load();
  };

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: 900 }}>
      <div className="card">
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Draw control
        </h1>
        <form
          onSubmit={onSimulate}
          style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end' }}
        >
          <div className="input-group">
            <label className="input-label">Year</label>
            <input
              className="input-field"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Month</label>
            <input
              className="input-field"
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          </div>
          <button className="secondary-button" type="submit">
            Simulate
          </button>
          {simResult && (
            <button
              type="button"
              className="primary-button"
              onClick={onPublish}
            >
              Publish draw
            </button>
          )}
        </form>
        {simResult && (
          <div style={{ marginTop: '0.7rem', fontSize: '0.85rem' }}>
            Simulated numbers:{' '}
            {simResult.drawnNumbers?.join(', ') ?? 'n/a'}
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          Published draws
        </h2>
        {draws.map((d) => (
          <div
            key={d.id}
            style={{
              padding: '0.4rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.85rem',
            }}
          >
            <strong>
              {d.month}/{d.year}
            </strong>{' '}
            – numbers {d.drawnNumbers.join(', ')} – pool ₹
            {(d.prizePoolTotal / 100).toLocaleString()} – winners:{' '}
            {d.winners.length}
          </div>
        ))}
      </div>
    </div>
  );
}