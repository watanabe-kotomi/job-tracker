import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { clearToken } from '../lib/auth';

interface JobApplication {
  id: string;
  company: { id: string; name: string };
  positionTitle: string;
  status: string;
  appliedAt: string | null;
  location: string | null;
  updatedAt: string;
}

interface PaginatedResponse {
  items: JobApplication[];
  total: number;
  page: number;
  limit: number;
}

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  applied:    { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  interview:  { backgroundColor: '#fef9c3', color: '#854d0e' },
  offer:      { backgroundColor: '#dcfce7', color: '#166534' },
  rejected:   { backgroundColor: '#fee2e2', color: '#991b1b' },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { backgroundColor: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ ...styles.badge, ...style }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function JobApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<PaginatedResponse>('/api/job-applications')
      .then(({ data }) => setApplications(data.items))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Job Tracker</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log out
        </button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.subheading}>Applications</h2>

        {loading && <p style={styles.message}>Loading…</p>}
        {error && <p style={{ ...styles.message, color: '#dc2626' }}>{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <p style={styles.message}>No applications yet.</p>
        )}

        {!loading && !error && applications.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Position</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Applied</th>
                  <th style={styles.th}>Location</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={styles.tr}>
                    <td style={styles.td}>{app.positionTitle}</td>
                    <td style={styles.td}>{app.company.name}</td>
                    <td style={styles.td}><StatusBadge status={app.status} /></td>
                    <td style={styles.td}>{app.appliedAt ?? '—'}</td>
                    <td style={styles.td}>{app.location ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
  },
  heading: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  logoutButton: {
    padding: '0.375rem 0.875rem',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    color: '#374151',
  },
  main: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  subheading: {
    margin: '0 0 1.25rem',
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  message: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '0.75rem 1rem',
    color: '#111827',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};
