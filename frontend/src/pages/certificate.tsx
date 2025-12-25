import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Certificate(): JSX.Element {
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/certificate/status');
      setStatus(response.data);
    } catch (err: any) {
      console.error('Error checking eligibility:', err);
      setError('Failed to check certificate eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!userName.trim()) {
      setError('Please enter your full name');
      return;
    }

    try {
      setDownloading(true);
      setError('');

      const response = await api.post('/api/certificate/generate', {
        user_name: userName.trim()
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${userName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate certificate');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Certificate" description="Download your course completion certificate">
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <Loader2 size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Checking eligibility...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Certificate" description="Download your course completion certificate">
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.messageCard}
          >
            <AlertCircle size={64} color="#f59e0b" />
            <h2 style={styles.messageTitle}>Please Sign In</h2>
            <p style={styles.messageText}>You need to be signed in to access your certificate.</p>
            <a href="/auth/signin" style={styles.linkButton}>
              Sign In
            </a>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!status?.eligible_for_certificate) {
    return (
      <Layout title="Certificate" description="Download your course completion certificate">
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.requirementsCard}
          >
            <Award size={64} color="#9ca3af" />
            <h2 style={styles.requirementsTitle}>Certificate Requirements</h2>

            <div style={styles.requirementsList}>
              <div style={styles.requirementItem}>
                {status?.all_chapters_done ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <p style={styles.requirementTitle}>Complete All 13 Chapters</p>
                  <p style={styles.requirementSubtext}>
                    {status?.chapters_completed || 0} / 13 chapters completed
                  </p>
                </div>
              </div>

              <div style={styles.requirementItem}>
                {status?.assessment_taken ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <p style={styles.requirementTitle}>Take the Final Assessment</p>
                  <p style={styles.requirementSubtext}>
                    {status?.assessment_taken ? 'Assessment completed' : 'Not taken yet'}
                  </p>
                </div>
              </div>

              <div style={styles.requirementItem}>
                {status?.assessment_passed ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <p style={styles.requirementTitle}>Pass with 70% or Higher</p>
                  <p style={styles.requirementSubtext}>
                    {status?.assessment_score !== null
                      ? `Your score: ${status.assessment_score}%`
                      : 'Assessment not taken'}
                  </p>
                </div>
              </div>
            </div>

            {!status?.all_chapters_done && (
              <a href="/docs/BOOK/Chapter%201%20-%20Introduction%20to%20Physical%20AI" style={styles.actionButton}>
                Continue Learning
              </a>
            )}

            {status?.all_chapters_done && !status?.assessment_taken && (
              <a href="/assessment" style={styles.actionButton}>
                Take Final Assessment
              </a>
            )}

            {status?.assessment_taken && !status?.assessment_passed && (
              <a href="/assessment" style={styles.actionButton}>
                Retake Assessment
              </a>
            )}
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Certificate" description="Download your course completion certificate">
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.certificateCard}
        >
          <Award size={80} color="#10b981" />
          <h1 style={styles.congratsTitle}>🎉 Congratulations!</h1>
          <p style={styles.congratsText}>
            You've successfully completed the Physical AI & Humanoid Robotics course and passed the final assessment with <strong>{status.assessment_score}%</strong>!
          </p>

          <div style={styles.achievementStats}>
            <div style={styles.statBox}>
              <CheckCircle2 size={32} color="#10b981" />
              <div>
                <p style={styles.statLabel}>Chapters Completed</p>
                <p style={styles.statValue}>13 / 13</p>
              </div>
            </div>
            <div style={styles.statBox}>
              <Award size={32} color="#3b82f6" />
              <div>
                <p style={styles.statLabel}>Final Score</p>
                <p style={styles.statValue}>{status.assessment_score}%</p>
              </div>
            </div>
          </div>

          <div style={styles.downloadSection}>
            <h3 style={styles.downloadTitle}>Download Your Certificate</h3>
            <p style={styles.downloadSubtext}>Enter your full name as you want it to appear on the certificate:</p>

            <input
              type="text"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={styles.nameInput}
            />

            <button
              onClick={handleDownloadCertificate}
              disabled={!userName.trim() || downloading}
              style={{
                ...styles.downloadButton,
                opacity: !userName.trim() || downloading ? 0.6 : 1,
                cursor: !userName.trim() || downloading ? 'not-allowed' : 'pointer'
              }}
            >
              {downloading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Certificate (PDF)
                </>
              )}
            </button>

            {error && (
              <div style={styles.errorBanner}>
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '3rem 1rem',
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.125rem',
    color: '#6b7280',
  },
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '3rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  },
  messageTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  messageText: {
    fontSize: '1.125rem',
    color: '#6b7280',
  },
  linkButton: {
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  requirementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '3rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
  },
  requirementsTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'center' as const,
  },
  requirementsList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
  },
  requirementTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: 0,
    marginBottom: '0.25rem',
  },
  requirementSubtext: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  actionButton: {
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  certificateCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '3rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  },
  congratsTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'center' as const,
  },
  congratsText: {
    fontSize: '1.25rem',
    color: '#374151',
    textAlign: 'center' as const,
    maxWidth: '600px',
  },
  achievementStats: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  downloadSection: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginTop: '1rem',
  },
  downloadTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    textAlign: 'center' as const,
  },
  downloadSubtext: {
    fontSize: '1rem',
    color: '#6b7280',
    textAlign: 'center' as const,
    margin: 0,
  },
  nameInput: {
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    outline: 'none',
  },
  downloadButton: {
    padding: '1rem 2rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  errorBanner: {
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
};
