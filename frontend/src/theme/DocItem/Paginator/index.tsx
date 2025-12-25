import React from 'react';
import Paginator from '@theme-original/DocItem/Paginator';
import type PaginatorType from '@theme/DocItem/Paginator';
import type { WrapperProps } from '@docusaurus/types';
import { userService } from '@site/src/services/userService';

type Props = WrapperProps<typeof PaginatorType>;

/**
 * Custom wrapper for DocItem Paginator that marks chapters as complete
 * when clicking "Next Chapter" button
 */
export default function PaginatorWrapper(props: Props): JSX.Element {
  const handleNextClick = async (event: React.MouseEvent) => {
    try {
      // Extract current chapter number from URL
      const currentPath = window.location.pathname;
      const chapterMatch = currentPath.match(/Chapter[%\s-]+(\d+)/i);

      if (chapterMatch) {
        const chapterNumber = parseInt(chapterMatch[1], 10);

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token && chapterNumber >= 1 && chapterNumber <= 13) {
          // Mark current chapter as completed when clicking "Next"
          await userService.updateProgress(chapterNumber, true);
          console.log(`✅ Chapter ${chapterNumber} marked as completed!`);
        }
      }
    } catch (error) {
      console.debug('Could not mark chapter as complete:', error);
    }
  };

  // Add click handler to Next button
  React.useEffect(() => {
    const nextButton = document.querySelector('.pagination-nav__link--next');
    if (nextButton) {
      nextButton.addEventListener('click', handleNextClick as any);
      return () => {
        nextButton.removeEventListener('click', handleNextClick as any);
      };
    }
  }, []);

  return <Paginator {...props} />;
}
