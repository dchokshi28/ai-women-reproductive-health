import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Cycles
export const cyclesAPI = {
  create: (data) => api.post('/cycles/', data),
  getAll: () => api.get('/cycles/'),
  predict: (data) => api.post('/cycles/predict', data),
};

// Posts
export const postsAPI = {
  getAll: () => api.get('/posts/'),
};

// Quiz
export const quizAPI = {
  getQuestions: () => api.get('/quiz/questions'),
  submit: (data) => api.post('/quiz/submit', data),
};

// Chat
export const chatAPI = {
  getMessages: () => api.get('/chat/messages'),
  sendMessage: (data) => api.post('/chat/messages', data),
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updateSubscription: (data) => api.post('/user/subscription', data),
};

// AI Agent
export const aiAPI = {
  ask: (question) => api.post('/ai/ask', { question }),
};

export default api;
