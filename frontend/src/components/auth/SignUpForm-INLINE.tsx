import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileSelectionModal from './ProfileSelectionModal';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      setShowProfileModal(true);
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to server. Backend must be running on http://localhost:8000');
      } else if (err.response?.status === 409) {
        setError('Email already exists. Please sign in instead.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed.');
      }
      setIsLoading(false);
    }
  };

  const handleProfileSet = () => {
    window.location.assign('/docs/intro');
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  };

  const logoStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    color: 'white'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    background: isLoading || !passwordsMatch ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: isLoading || !passwordsMatch ? 'not-allowed' : 'pointer',
    marginBottom: '20px'
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={logoStyle}>🚀</div>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: '#1a202c' }}>
            Create Account
          </h2>

          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '30px' }}>
            Start your robotics learning journey
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                Password * (min 6 characters)
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginTop: '5px', background: 'none', border: 'none', cursor: 'pointer', color: '#667eea' }}>
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                Confirm Password *
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ marginTop: '5px', background: 'none', border: 'none', cursor: 'pointer', color: '#667eea' }}>
                {showConfirmPassword ? 'Hide' : 'Show'} Password
              </button>
              {confirmPassword && passwordsMatch && (
                <div style={{ marginTop: '8px', color: '#48bb78' }}>✓ Passwords match</div>
              )}
              {confirmPassword && !passwordsMatch && (
                <div style={{ marginTop: '8px', color: '#f56565' }}>✗ Passwords do not match</div>
              )}
            </div>

            <button type="submit" disabled={isLoading || !passwordsMatch} style={buttonStyle}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#718096' }}>Already have an account? </span>
              <a href="/auth/signin" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>

      {showProfileModal && <ProfileSelectionModal onComplete={handleProfileSet} />}
    </>
  );
}
