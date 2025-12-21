import { useState, useEffect } from 'react';

interface SelectionPosition {
  top: number;
  left: number;
}

export function useSelection() {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<SelectionPosition | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) {
        const range = selection!.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setSelectionPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
        });
      } else {
        setSelectedText('');
        setSelectionPosition(null);
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 10);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const clearSelection = () => {
    setSelectedText('');
    setSelectionPosition(null);
  };

  return {
    selectedText,
    selectionPosition,
    clearSelection,
  };
}
