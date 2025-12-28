import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  
  getMe: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  list: (skip = 0, limit = 50) =>
    api.get(`/projects/?skip=${skip}&limit=${limit}`),
  
  get: (id: number) => api.get(`/projects/${id}`),
  
  create: (data: { name: string; description?: string; blocks?: string; tags?: string[] }) =>
    api.post('/projects/', data),
  
  update: (id: number, data: Partial<{ name: string; description: string; blocks: string; tags: string[]; is_public: boolean }>) =>
    api.put(`/projects/${id}`, data),
  
  delete: (id: number) => api.delete(`/projects/${id}`),
  
  duplicate: (id: number) => api.post(`/projects/${id}/duplicate`),
};

// Devices API
export const devicesAPI = {
  list: () => api.get('/devices/'),
  
  get: (id: number) => api.get(`/devices/${id}`),
  
  register: (data: { name: string; device_type: string; ip_address?: string }) =>
    api.post('/devices/', data),
  
  update: (id: number, data: Partial<{ name: string; status: string; ip_address: string }>) =>
    api.put(`/devices/${id}`, data),
  
  remove: (id: number) => api.delete(`/devices/${id}`),
  
  ping: (id: number) => api.post(`/devices/${id}/ping`),
  
  uploadCode: (id: number) => api.post(`/devices/${id}/upload`),
};

// AI Models API
export const aiModelsAPI = {
  list: (modelType?: string) =>
    api.get('/ai-models/', { params: { model_type: modelType } }),
  
  get: (id: number) => api.get(`/ai-models/${id}`),
  
  test: (id: number) => api.post(`/ai-models/${id}/test`),
  
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai-models/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Code Generation API
export const codeAPI = {
  generate: (blocks: string, language: string, targetDevice?: string) =>
    api.post('/code/generate', { blocks, language, target_device: targetDevice }),
  
  validate: (blocks: string, language: string) =>
    api.post('/code/validate', { blocks, language }),
  
  getTemplate: (templateName: string, language = 'python') =>
    api.get(`/code/templates/${templateName}`, { params: { language } }),
};

// Tutorials API
export const tutorialsAPI = {
  list: (category?: string, difficulty?: string) =>
    api.get('/tutorials/', { params: { category, difficulty } }),
  
  get: (id: number) => api.get(`/tutorials/${id}`),
  
  complete: (id: number) => api.post(`/tutorials/${id}/complete`),
  
  getProgress: () => api.get('/tutorials/progress/me'),
};

export default api;
