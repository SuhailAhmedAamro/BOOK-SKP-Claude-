import React, { useEffect } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { LanguageProvider } from '../contexts/LanguageContext';
import ChatWidget from '../components/chat/ChatWidget';
import { useSelection } from '../hooks/useSelection';
import SelectionButton from '../components/chat/SelectionButton';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { validateEnv } from '../utils/env';

function SelectionHandler() {
  const { selectedText, selectionPosition, clearSelection } = useSelection();

  if (!selectedText || !selectionPosition) return null;

  const handleClick = () => {
    // Store selected text for chat widget
    sessionStorage.setItem('selectedTextForChat', selectedText);

    // Dispatch event to open chat with selection
    window.dispatchEvent(new CustomEvent('openChatWithSelection', {
      detail: { selectedText }
    }));

    clearSelection();
  };

  return <SelectionButton position={selectionPosition} onClick={handleClick} />;
}

export default function Root({ children }) {
  useEffect(() => {
    // Validate environment on app startup
    validateEnv();
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          {children}
          <ChatWidget />
          <SelectionHandler />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
