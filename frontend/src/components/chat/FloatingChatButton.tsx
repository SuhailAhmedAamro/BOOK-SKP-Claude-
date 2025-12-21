import React from 'react';

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingChatButton({ onClick, isOpen }: Props) {
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9998,
    transition: 'all 0.3s ease',
    animation: isOpen ? 'none' : 'pulse 2s ease-in-out infinite'
  };

  return (
    <>
      <button
        onClick={onClick}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
        }}
      >
        {isOpen ? (
          <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(147, 51, 234, 0.6);
          }
        }
      `}</style>
    </>
  );
}
