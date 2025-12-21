import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';
import { userService, UserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (background: 'Software' | 'Hardware') => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize user from localStorage immediately to avoid flash of unauthenticated state
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      if (authService.isAuthenticated()) {
        const sessionUser = await authService.getSession();
        setUser(sessionUser);

        // Try to fetch profile
        try {
          const userProfile = await userService.getProfile();
          setProfileState(userProfile);
        } catch (error) {
          // Profile might not exist yet
          console.log('No profile found');
        }
      } else {
        // No token, ensure user state is cleared
        setUser(null);
        setProfileState(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      authService.clearAuth();
      setUser(null);
      setProfileState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.signIn({ email, password });
      authService.saveToken(response.access_token, response.user);
      setUser(response.user);

      // Fetch profile
      try {
        const userProfile = await userService.getProfile();
        setProfileState(userProfile);
      } catch (error) {
        // Profile might not exist yet
        console.log('No profile found');
      }
    } catch (error) {
      // Re-throw with better error message
      if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again in a minute.');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const response = await authService.signUp({ email, password, name });
    authService.saveToken(response.access_token, response.user);
    setUser(response.user);
    // Profile will be set after user selects background
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      authService.clearAuth();
      setUser(null);
      setProfileState(null);
    }
  };

  const setProfile = async (background: 'Software' | 'Hardware') => {
    const userProfile = await userService.createProfile(background);
    setProfileState(userProfile);
  };

  const refreshSession = async () => {
    await checkSession();
  };

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    setProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
