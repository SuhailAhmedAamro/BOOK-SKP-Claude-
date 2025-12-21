import api from './api';

export interface ChatMessage {
  message: string;
  selected_text?: string;
  chapter_number?: number;
  session_id: string;
}

export interface Source {
  chapter: number;
  section: string;
  excerpt: string;
  score: number;
}

export interface ChatResponse {
  message: string;
  sources: Source[];
}

export interface TranslateRequest {
  text: string;
  target_lang: string;
}

export interface TranslateResponse {
  translated: string;
}

export const chatService = {
  async sendMessage(data: ChatMessage): Promise<ChatResponse> {
    const response = await api.post('/api/chat', data);
    return response.data;
  },

  async getChatHistory(sessionId: string): Promise<any> {
    const response = await api.get(`/api/chat/history?session_id=${sessionId}`);
    return response.data;
  },

  async translate(text: string, targetLang: string = 'ur'): Promise<string> {
    const response = await api.post<TranslateResponse>('/api/chat/translate', {
      text,
      target_lang: targetLang,
    });
    return response.data.translated;
  },
};
