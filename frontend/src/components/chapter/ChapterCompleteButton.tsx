import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

export const ChapterCompleteButton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);

  useEffect(() => {
    // Extract chapter number from URL
    const path = window.location.pathname;
    const match = path.match(/Chapter[%\s-]+(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      setChapterNumber(num);
      checkCompletion(num);
    }
  }, [window.location.pathname]);

  const checkCompletion = async (num: number) => {
    try {
      const progress = await userService.getProgress();
      const chapter = progress.chapters.find((c) => c.chapter_number === num);
      setIsCompleted(chapter?.completed || false);
    } catch (error) {
      console.debug('Could not check completion status');
    }
  };

  const handleMarkComplete = async () => {
    if (!chapterNumber || isLoading) return;

    setIsLoading(true);
    try {
      await userService.updateProgress(chapterNumber, true);
      setIsCompleted(true);

      // Show success message
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        font-weight: 600;
      `;
      message.textContent = `✅ Chapter ${chapterNumber} marked as completed!`;
      document.body.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 3000);
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      alert('Please sign in to mark chapters as complete');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !chapterNumber) return null;

  return (
    <div style={styles.container}>
      {isCompleted ? (
        <div style={styles.completedBadge}>
          <CheckCircle2 size={20} />
          <span>Chapter Completed!</span>
        </div>
      ) : (
        <button
          onClick={handleMarkComplete}
          disabled={isLoading}
          style={{
            ...styles.button,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Marking...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: '2rem 0',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  completedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: '2px solid #10b981',
  },
};

export default ChapterCompleteButton;
