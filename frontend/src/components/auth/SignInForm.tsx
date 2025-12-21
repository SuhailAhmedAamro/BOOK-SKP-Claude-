import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      // FORCE REDIRECT
      window.location.assign('/docs/intro');
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to server. Backend must be running on http://localhost:8000');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Sign in failed. Please try again.');
      }
      setIsLoading(false);
    }
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
    background: isLoading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    marginBottom: '20px',
    marginTop: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={logoStyle}>🔐</div>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: '#1a202c' }}>
          Welcome Back!
        </h2>

        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '30px' }}>
          Sign in to continue your learning
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
              Email Address
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
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginTop: '5px', background: 'none', border: 'none', cursor: 'pointer', color: '#667eea' }}
            >
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ color: '#4a5568' }}>Remember me</span>
            </label>
            <a href="/auth/forgot-password" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#718096' }}>Don't have an account? </span>
            <a href="/auth/signup" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
