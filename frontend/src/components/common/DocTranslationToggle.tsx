import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { TranslationToggle } from './TranslationToggle';

/**
 * Docusaurus-compatible Translation Toggle for chapter pages
 * Usage in .mdx files:
 *
 * import DocTranslationToggle from '@site/src/components/common/DocTranslationToggle';
 *
 * <DocTranslationToggle />
 *
 * This will automatically translate all content below it when toggled.
 */
export const DocTranslationToggle: React.FC = () => {
  const [isTranslated, setIsTranslated] = useState(false);

  return (
    <BrowserOnly fallback={<div>Loading translation toggle...</div>}>
      {() => {
        const getPageContent = (): string => {
          // Get the main article content from Docusaurus
          const article = document.querySelector('article.markdown');
          if (!article) return '';

          // Extract text content, excluding the translation toggle itself
          const content = article.textContent || '';
          return content;
        };

        const handleTranslation = (translatedText: string) => {
          if (translatedText) {
            setIsTranslated(true);
            // Store translated content for potential use
            console.log('Content translated to Urdu');
          } else {
            setIsTranslated(false);
            console.log('Switched back to English');
          }
        };

        return (
          <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <TranslationToggle
              originalContent={getPageContent()}
              onTranslate={handleTranslation}
            />

            {isTranslated && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#166534',
                }}
              >
                📖 <strong>Note:</strong> Translation is powered by Google Gemini AI.
                For technical accuracy, refer to the original English content.
              </div>
            )}
          </div>
        );
      }}
    </BrowserOnly>
  );
};

export default DocTranslationToggle;
