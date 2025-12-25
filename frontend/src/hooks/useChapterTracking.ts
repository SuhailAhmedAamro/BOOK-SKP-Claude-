import { useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import { userService } from '../services/userService';

/**
 * Custom hook to automatically track chapter progress
 * Tracks when a user visits a chapter page and updates their progress
 */
export function useChapterTracking() {
  const location = useLocation();
  const lastTrackedChapter = useRef<number | null>(null);

  useEffect(() => {
    const trackChapterVisit = async () => {
      try {
        // Extract chapter number from URL path
        // Expected format: /docs/BOOK/Chapter%201%20-%20Introduction or /BOOK/Chapter-1-Introduction
        const pathMatch = location.pathname.match(/Chapter[%\s-]+(\d+)/i);

        if (pathMatch) {
          const chapterNumber = parseInt(pathMatch[1], 10);

          // Only track if it's a valid chapter number (1-13) and we haven't tracked it in this session
          if (chapterNumber >= 1 && chapterNumber <= 13 && chapterNumber !== lastTrackedChapter.current) {
            // Check if user is authenticated before tracking
            const token = localStorage.getItem('token');
            if (token) {
              // Update last_accessed without marking as completed
              await userService.updateProgress(chapterNumber, false);
              lastTrackedChapter.current = chapterNumber;
              console.log(`📖 Tracked visit to Chapter ${chapterNumber}`);
            }
          }
        }
      } catch (error) {
        // Silently fail if user is not authenticated or other error occurs
        console.debug('Chapter tracking skipped:', error);
      }
    };

    trackChapterVisit();
  }, [location.pathname]);
}

/**
 * Hook to mark a chapter as completed (e.g., after quiz or manual completion)
 */
export function useMarkChapterComplete() {
  return async (chapterNumber: number) => {
    try {
      await userService.updateProgress(chapterNumber, true);
      console.log(`✅ Chapter ${chapterNumber} marked as completed!`);
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      throw error;
    }
  };
}
