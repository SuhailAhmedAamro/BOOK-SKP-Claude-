import React from 'react';

interface Props {
  position: { top: number; left: number };
  onClick: () => void;
}

export default function SelectionButton({ position, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      Ask about this
    </button>
  );
}
