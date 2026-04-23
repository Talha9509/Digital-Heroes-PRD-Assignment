import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { api, API_URL } from '../../api/client';

interface WinnerProof {
  imageUrl: string;
}

interface Draw {
  year: number;
  month: number;
}

interface Winner {
  id: string;
  matchType: 'MATCH_5' | 'MATCH_4' | 'MATCH_3';
  prizeAmount: number;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'PAID';
  proofUpload?: WinnerProof;
  draw: Draw;
}

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async () => {
    const data = await api.get<Winner[]>('/winners/me');
    setWinnings(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const onFileChange = async (w: Winner, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('accessToken');
    setUploadingId(w.id);
    try {
      const form = new FormData();
      form.append('proof', file);

      const res = await fetch(
        `${API_URL}/winners/${w.id}/proof`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        },
      );
      if (!res.ok) throw new Error('Upload failed');
      await load();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <div className="card">Loading winnings...</div>;

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
          Winnings & verification
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          If you hit a winning combination, upload proof from your
          official score record so an admin can verify and release your
          payout.[file:1]
        </p>
      </div>

      {winnings.length === 0 ? (
        <div className="card">
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            You don’t have any winnings yet. Your next round could
            change that.
          </p>
        </div>
      ) : (
        <div className="card">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
                <th>Month</th>
                <th>Tier</th>
                <th>Prize</th>
                <th>Verification</th>
                <th>Payout</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {winnings.map((w) => (
                <tr key={w.id}>
                  <td>
                    {w.draw.month}/{w.draw.year}
                  </td>
                  <td>{w.matchType.replace('MATCH_', '')}-number</td>
                  <td>₹{(w.prizeAmount / 100).toLocaleString()}</td>
                  <td>{w.verificationStatus}</td>
                  <td>{w.paymentStatus}</td>
                  <td>
                    {w.proofUpload?.imageUrl ? (
                      <a
                        href={w.proofUpload.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <label
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--accent-alt)',
                          cursor: 'pointer',
                        }}
                      >
                        {uploadingId === w.id
                          ? 'Uploading...'
                          : 'Upload proof'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => onFileChange(w, e)}
                          disabled={uploadingId === w.id}
                        />
                      </label>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}