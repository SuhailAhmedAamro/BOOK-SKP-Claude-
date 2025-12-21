import React, { useState } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

export default function Navbar(): React.ReactElement {
  const history = useHistory();
  const location = useLocation();
  const { colorMode, setColorMode } = useColorMode();
  const { isAuthenticated, user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignIn = () => {
    history.push('/auth/signin');
  };

  const handleSignUp = () => {
    history.push('/auth/signup');
  };

  const handleProfile = () => {
    setShowProfileMenu(false);
    history.push('/profile');
  };

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
    history.push('/');
  };

  const toggleDarkMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    setLanguage(newLanguage);

    // Handle Docusaurus i18n routing
    const currentPath = location.pathname;
    let newPath = currentPath;

    if (newLanguage === 'ur') {
      // Switch to Urdu: add /ur prefix if not already present
      if (!currentPath.startsWith('/ur/')) {
        newPath = '/ur' + currentPath;
      }
    } else {
      // Switch to English: remove /ur prefix
      if (currentPath.startsWith('/ur/')) {
        newPath = currentPath.replace(/^\/ur/, '') || '/';
      }
    }

    // Navigate to the new path if it changed
    if (newPath !== currentPath) {
      history.push(newPath);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => history.push('/')}>
          <img src="/img/logo.svg" alt="Logo" className="logo-img" />
          <span className="logo-text">Physical AI Portal</span>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="navbar-btn navbar-btn-icon"
            title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
          >
            <span className="language-label">{language === 'en' ? 'EN' : 'اردو'}</span>
          </motion.button>

          {/* Dark/Light Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="navbar-btn navbar-btn-icon"
            title={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {colorMode === 'dark' ? (
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </motion.button>

          {/* Auth Buttons / Profile */}
          {!isAuthenticated ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="navbar-btn navbar-btn-outline"
              >
                {t('nav.signIn')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUp}
                className="navbar-btn navbar-btn-primary"
              >
                {t('nav.signUp')}
              </motion.button>
            </>
          ) : (
            <div className="profile-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="profile-button"
              >
                <div className="profile-avatar">
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <span className="profile-name">{user?.name || 'User'}</span>
                <svg
                  className={`chevron ${showProfileMenu ? 'open' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="profile-menu"
                  >
                    <div className="profile-menu-header">
                      <div className="profile-menu-avatar">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </div>
                      <div className="profile-menu-info">
                        <div className="profile-menu-name">{user?.name || 'User'}</div>
                        <div className="profile-menu-email">{user?.email || ''}</div>
                      </div>
                    </div>
                    <div className="profile-menu-divider"></div>
                    <button onClick={handleProfile} className="profile-menu-item">
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {t('nav.profile')}
                    </button>
                    <div className="profile-menu-divider"></div>
                    <button onClick={handleSignOut} className="profile-menu-item profile-menu-item-danger">
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {t('nav.signOut')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div className="profile-menu-backdrop" onClick={() => setShowProfileMenu(false)}></div>
      )}
    </nav>
  );
}
