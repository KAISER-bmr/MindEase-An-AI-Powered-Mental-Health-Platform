import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindease_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mindease_token');
      localStorage.removeItem('mindease_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Chat
export const sendMessage = (data) => api.post('/chat/message', data);
export const getSessions = () => api.get('/chat/sessions');
export const getMessages = (sessionId) => api.get(`/chat/sessions/${sessionId}/messages`);

// Mood
export const logMood = (data) => api.post('/mood/log', data);
export const getMoodHistory = (limit = 30) => api.get(`/mood/history?limit=${limit}`);
export const getMoodStats = () => api.get('/mood/stats');

// Assessment
export const submitAssessment = (data) => api.post('/assessment/submit', data);
export const getAssessmentHistory = () => api.get('/assessment/history');

export default api;
