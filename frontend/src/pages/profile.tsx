import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@theme/Layout';
import { ProgressTrackerDashboard } from '../components/common/ProgressTrackerDashboard';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from '@docusaurus/router';
import PageTransition from '../components/common/PageTransition';

export default function ProfilePage(): React.ReactElement {
  const { isAuthenticated, user, isLoading } = useAuth();
  const history = useHistory();

  // Redirect to sign-in if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history.push('/auth/signin?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, history]);

  if (isLoading) {
    return (
      <Layout title="Profile" description="User Profile and Progress">
        <PageTransition variant="fade">
          <div style={styles.loadingContainer}>
            <div style={styles.shimmerContainer}>
              <div className="shimmer skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '20px' }}></div>
              <div className="shimmer skeleton" style={{ width: '250px', height: '32px', marginBottom: '12px' }}></div>
              <div className="shimmer skeleton" style={{ width: '200px', height: '20px' }}></div>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Profile" description="User Profile and Progress">
        <div style={styles.errorContainer}>
          <p>Please sign in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="My Profile"
      description="Track your learning progress and manage your profile"
    >
      <PageTransition variant="slideUp">
        <main style={styles.main}>
          {/* User Info Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.userHeader}
            className="glass-card glow-on-hover"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              style={styles.avatar}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <div>
              <h1 style={styles.userName}>{user?.name || 'Student'}</h1>
              <p style={styles.userEmail}>{user?.email || ''}</p>
            </div>
          </motion.div>

          {/* Progress Dashboard */}
          <ProgressTrackerDashboard />
        </main>
      </PageTransition>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        [data-theme='dark'] .user-header {
          background-color: #1e293b !important;
        }

        [data-theme='dark'] .avatar {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
        }
      `}</style>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#f9fafb',
    borderRadius: '1rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#111827',
  },
  userEmail: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem',
  },
  shimmerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '1.125rem',
    color: '#dc2626',
  },
};
