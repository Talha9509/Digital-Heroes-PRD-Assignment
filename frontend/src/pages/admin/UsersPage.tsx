import { useEffect, useState } from 'react';
import { api } from '../../api/client';


type SubscriptionStatus = 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

interface User {
  id: string;
  email: string;
  role: 'SUBSCRIBER' | 'ADMIN';
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>('/admin/users').then(setUsers).catch(() => {});
  }, []);

  return (
    <div className="card">
      <h1 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>
        Users
      </h1>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          marginTop: '0.6rem',
        }}
      >
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Plan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.subscriptionStatus}</td>
              <td>{u.subscriptionPlan ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}