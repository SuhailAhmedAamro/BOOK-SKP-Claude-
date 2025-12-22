import api from './api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/signin', data);
    return response.data;
  },

  async signOut(): Promise<void> {
    await api.post('/api/auth/signout');
  },

  async getSession(): Promise<User> {
    const response = await api.get('/api/auth/session');
    return response.data;
  },

  saveToken(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null; // SSR: no localStorage available
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR: treat as not authenticated
    }
    return !!localStorage.getItem('auth_token');
  },
};
