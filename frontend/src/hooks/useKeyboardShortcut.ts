import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean }
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 1. Pehle check karein ke event aur key mojood hain
      if (!event || !event.key) return;

      const ctrlMatch = !modifiers?.ctrl || event.ctrlKey || event.metaKey;
      const altMatch = !modifiers?.alt || event.altKey;
      const shiftMatch = !modifiers?.shift || event.shiftKey;

      // 2. Safe toLowerCase check
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, modifiers]);
}