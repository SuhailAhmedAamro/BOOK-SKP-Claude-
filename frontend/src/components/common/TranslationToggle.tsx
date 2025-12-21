import React, { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { chatService } from '../../services/chatService';

interface TranslationToggleProps {
  originalContent: string;
  onTranslate?: (translatedText: string) => void;
}

export const TranslationToggle: React.FC<TranslationToggleProps> = ({
  originalContent,
  onTranslate,
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUrdu, setIsUrdu] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [error, setError] = useState('');

  const handleToggle = async () => {
    if (isUrdu) {
      // Switch back to English
      setIsUrdu(false);
      setError('');
      if (onTranslate) {
        onTranslate(originalContent);
      }
      return;
    }

    // Translate to Urdu
    setIsTranslating(true);
    setError('');

    try {
      const translated = await chatService.translate(originalContent, 'ur');
      setTranslatedContent(translated);
      setIsUrdu(true);
      if (onTranslate) {
        onTranslate(translated);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="translation-toggle-container" style={{ marginBottom: '1.5rem' }}>
      <button
        onClick={handleToggle}
        disabled={isTranslating}
        className={`translation-toggle-button ${isUrdu ? 'active' : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          borderRadius: '0.5rem',
          border: '2px solid',
          borderColor: isUrdu ? '#10b981' : '#3b82f6',
          backgroundColor: isUrdu ? '#ecfdf5' : '#eff6ff',
          color: isUrdu ? '#065f46' : '#1e40af',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: isTranslating ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: isTranslating ? 0.6 : 1,
        }}
        aria-label={isUrdu ? 'Switch to English' : 'Translate to Urdu'}
      >
        {isTranslating ? (
          <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <Languages size={16} />
        )}
        <span>
          {isTranslating ? 'Translating...' : isUrdu ? '🇵🇰 اردو میں' : '🇬🇧 Translate to Urdu'}
        </span>
      </button>

      {error && (
        <div
          className="translation-error"
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '0.375rem',
            color: '#991b1b',
            fontSize: '0.875rem',
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .translation-toggle-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .translation-toggle-button:active:not(:disabled) {
          transform: translateY(0);
        }

        [data-theme='dark'] .translation-toggle-button {
          background-color: ${isUrdu ? '#064e3b' : '#1e3a8a'} !important;
          color: ${isUrdu ? '#a7f3d0' : '#93c5fd'} !important;
          border-color: ${isUrdu ? '#10b981' : '#3b82f6'} !important;
        }

        [data-theme='dark'] .translation-error {
          background-color: #7f1d1d;
          border-color: #ef4444;
          color: #fca5a5;
        }
      `}</style>
    </div>
  );
};

export default TranslationToggle;
