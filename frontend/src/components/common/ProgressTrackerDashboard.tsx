import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';
import { userService, UserProgress, ChapterProgress } from '../../services/userService';

export const ProgressTrackerDashboard: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await userService.getProgress();
      setProgress(data);
      setError('');
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCompletedCount = () => {
    if (!progress) return 0;
    return progress.chapters.filter((ch) => ch.completed).length;
  };

  const getChapterStatus = (chapterNum: number): ChapterProgress | null => {
    if (!progress) return null;
    return progress.chapters.find((ch) => ch.chapter_number === chapterNum) || null;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="shimmer skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }}></div>
          <div style={{ flex: 1 }}>
            <div className="shimmer skeleton" style={{ width: '250px', height: '32px', marginBottom: '8px' }}></div>
            <div className="shimmer skeleton" style={{ width: '350px', height: '20px' }}></div>
          </div>
        </div>

        <div style={styles.progressCard} className="glass-card">
          <div className="shimmer skeleton" style={{ width: '200px', height: '28px', marginBottom: '16px' }}></div>
          <div className="shimmer skeleton" style={{ width: '100%', height: '24px', marginBottom: '16px' }}></div>
          <div className="shimmer skeleton" style={{ width: '150px', height: '20px' }}></div>
        </div>

        <div style={styles.chapterList}>
          <div className="shimmer skeleton" style={{ width: '180px', height: '28px', marginBottom: '16px' }}></div>
          <div style={styles.chapterGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer skeleton" style={{ height: '100px', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={loadProgress} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const completedCount = getCompletedCount();
  const totalChapters = 13;
  const completionPercentage = progress?.completion_percentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={styles.header}
      >
        <div style={styles.headerIcon}>
          <TrendingUp size={32} color="#10b981" />
        </div>
        <div>
          <h2 style={styles.title}>Your Learning Progress</h2>
          <p style={styles.subtitle}>Track your journey through Physical AI & Robotics</p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={styles.progressCard}
        className="glass-card glow-on-hover"
      >
        <div style={styles.progressHeader}>
          <h3 style={styles.progressTitle}>Overall Completion</h3>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
            style={styles.percentage}
          >
            {completionPercentage.toFixed(0)}%
          </motion.span>
        </div>

        <div style={styles.progressBarContainer}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            style={styles.progressBarFill}
          />
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.stat}>
            <BookOpen size={20} color="#3b82f6" />
            <span style={styles.statText}>
              {completedCount} / {totalChapters} Chapters
            </span>
          </div>
        </div>
      </motion.div>

      {/* Chapter List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={styles.chapterList}
      >
        <h3 style={styles.chapterListTitle}>Chapter Progress</h3>

        <div style={styles.chapterGrid}>
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapterNum, index) => {
            const status = getChapterStatus(chapterNum);
            const isCompleted = status?.completed || false;
            const lastAccessed = status?.last_accessed;

            return (
              <motion.div
                key={chapterNum}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  ...styles.chapterCard,
                  borderColor: isCompleted ? '#10b981' : '#e5e7eb',
                  backgroundColor: isCompleted ? '#ecfdf5' : '#ffffff',
                }}
                className="glow-on-hover"
              >
                <div style={styles.chapterHeader}>
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 + index * 0.05 }}
                    >
                      <CheckCircle2 size={24} color="#10b981" />
                    </motion.div>
                  ) : (
                    <Circle size={24} color="#9ca3af" />
                  )}
                  <span style={styles.chapterNumber}>Chapter {chapterNum}</span>
                </div>

                {lastAccessed && (
                  <div style={styles.chapterFooter}>
                    <Calendar size={14} color="#6b7280" />
                    <span style={styles.chapterDate}>{formatDate(lastAccessed)}</span>
                  </div>
                )}

                {!lastAccessed && (
                  <div style={styles.chapterFooter}>
                    <span style={styles.notStarted}>Not started</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        [data-theme='dark'] .progress-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
          border-color: #334155 !important;
        }

        [data-theme='dark'] .chapter-card {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }

        [data-theme='dark'] .chapter-card.completed {
          background-color: #064e3b !important;
          border-color: #10b981 !important;
        }
      `}</style>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  headerIcon: {
    padding: '1rem',
    backgroundColor: '#ecfdf5',
    borderRadius: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#111827',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  progressCard: {
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    border: '2px solid #e5e7eb',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  progressTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: '#111827',
  },
  percentage: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressBarContainer: {
    width: '100%',
    height: '1.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
    transition: 'width 0.5s ease',
    borderRadius: '0.75rem',
  },
  statsContainer: {
    display: 'flex',
    gap: '2rem',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#374151',
  },
  chapterList: {
    marginTop: '2rem',
  },
  chapterListTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#111827',
  },
  chapterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  chapterCard: {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    border: '2px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  chapterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  chapterNumber: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
  },
  chapterFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  chapterDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  notStarted: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  errorText: {
    fontSize: '1rem',
    color: '#dc2626',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ProgressTrackerDashboard;
