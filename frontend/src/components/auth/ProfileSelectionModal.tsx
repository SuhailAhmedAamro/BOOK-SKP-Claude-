import React, { useState } from 'react';
import { userService } from '../../services/userService';

interface Props {
  onComplete: () => void;
}

export default function ProfileSelectionModal({ onComplete }: Props) {
  const [selected, setSelected] = useState<'Software' | 'Hardware' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;

    setIsLoading(true);
    try {
      await userService.createProfile(selected);
      // Call onComplete callback
      onComplete();
      // Force navigation to docs
      window.location.assign('/docs/intro');
    } catch (error) {
      console.error('Failed to set profile:', error);
      alert('Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(59,130,246,0.4) 50%, rgba(147,51,234,0.6) 100%)',
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out'
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.3)',
    animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative'
  };

  const headerIconStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    boxShadow: '0 8px 20px rgba(59,130,246,0.4)',
    animation: 'bounce-slow 2s infinite'
  };

  const optionButtonStyle = (isSelected: boolean, color: 'blue' | 'purple'): React.CSSProperties => ({
    position: 'relative',
    padding: '24px',
    borderRadius: '16px',
    border: isSelected
      ? `2px solid ${color === 'blue' ? '#3b82f6' : '#9333ea'}`
      : '2px solid #e5e7eb',
    background: isSelected
      ? color === 'blue'
        ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.1) 100%)'
        : 'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.1) 100%)'
      : 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    boxShadow: isSelected
      ? `0 10px 30px ${color === 'blue' ? 'rgba(59,130,246,0.2)' : 'rgba(147,51,234,0.2)'}`
      : '0 2px 8px rgba(0,0,0,0.05)'
  });

  const checkmarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59,130,246,0.5)',
    animation: 'checkmark 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  const iconContainerStyle = (isSelected: boolean, color: 'blue' | 'purple'): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isSelected
      ? color === 'blue'
        ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
        : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
      : '#f3f4f6',
    transition: 'all 0.3s ease',
    boxShadow: isSelected ? '0 8px 20px rgba(0,0,0,0.2)' : 'none'
  });

  const submitButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    cursor: (!selected || isLoading) ? 'not-allowed' : 'pointer',
    opacity: (!selected || isLoading) ? 0.5 : 1,
    background: selected === 'Software'
      ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
      : selected === 'Hardware'
      ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
      : '#9ca3af',
    boxShadow: selected ? '0 8px 20px rgba(0,0,0,0.2)' : 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    marginTop: '24px'
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={headerIconStyle}>
            <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Choose Your Learning Path
          </h2>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Select your background to personalize your experience
          </p>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Software Option */}
          <button
            onClick={() => setSelected('Software')}
            style={optionButtonStyle(selected === 'Software', 'blue')}
            onMouseEnter={(e) => {
              if (selected !== 'Software') {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== 'Software') {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            {selected === 'Software' && (
              <div style={checkmarkStyle}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div style={iconContainerStyle(selected === 'Software', 'blue')}>
              <svg style={{ width: '32px', height: '32px', color: selected === 'Software' ? 'white' : '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: selected === 'Software' ? '#1e40af' : '#1f2937' }}>
              Software
            </h3>

            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              {[
                'ROS 2 programming & architecture',
                'Python/C++ implementation',
                'Simulation & testing tools'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <svg style={{ width: '20px', height: '20px', marginRight: '8px', marginTop: '2px', color: selected === 'Software' ? '#3b82f6' : '#9ca3af', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#4b5563', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>
          </button>

          {/* Hardware Option */}
          <button
            onClick={() => setSelected('Hardware')}
            style={optionButtonStyle(selected === 'Hardware', 'purple')}
            onMouseEnter={(e) => {
              if (selected !== 'Hardware') {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = '#9333ea';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== 'Hardware') {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            {selected === 'Hardware' && (
              <div style={checkmarkStyle}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div style={iconContainerStyle(selected === 'Hardware', 'purple')}>
              <svg style={{ width: '32px', height: '32px', color: selected === 'Hardware' ? 'white' : '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: selected === 'Hardware' ? '#7e22ce' : '#1f2937' }}>
              Hardware
            </h3>

            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              {[
                'NVIDIA Jetson Orin setup',
                'RealSense camera integration',
                'Physical robotics deployment'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <svg style={{ width: '20px', height: '20px', marginRight: '8px', marginTop: '2px', color: selected === 'Hardware' ? '#9333ea' : '#9ca3af', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#4b5563', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selected || isLoading}
          style={submitButtonStyle}
          onMouseEnter={(e) => {
            if (selected && !isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = selected ? '0 8px 20px rgba(0,0,0,0.2)' : 'none';
          }}
        >
          {isLoading ? (
            <>
              <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Setting up your profile...</span>
            </>
          ) : (
            <>
              <span>Continue to Learning</span>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '16px' }}>
          Don't worry! You can change this later in your profile settings
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
