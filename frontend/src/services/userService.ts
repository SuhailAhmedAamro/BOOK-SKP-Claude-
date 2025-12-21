import api from './api';

export interface UserProfile {
  user_id: string;
  background: 'Software' | 'Hardware';
  created_at: string;
}

export interface ChapterProgress {
  chapter_number: number;
  completed: boolean;
  last_accessed: string;
}

export interface UserProgress {
  chapters: ChapterProgress[];
  completion_percentage: number;
}

export const userService = {
  async createProfile(background: 'Software' | 'Hardware'): Promise<UserProfile> {
    const response = await api.post('/api/user/profile', { background });
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  async updateProgress(chapter_number: number, completed: boolean): Promise<void> {
    await api.post('/api/user/progress', { chapter_number, completed });
  },

  async getProgress(): Promise<UserProgress> {
    const response = await api.get('/api/user/progress');
    return response.data;
  },
};
