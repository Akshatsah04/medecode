import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw new Error(error.response.data.error || 'Registration failed.');
    throw new Error('Network error or server is down.');
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) throw new Error(error.response.data.error || 'Login failed.');
    throw new Error('Network error or server is down.');
  }
};

// Report Services
export const analyzeReport = async (file, mode = 'Simple', language = 'English') => {
  const formData = new FormData();
  formData.append('report', file);
  formData.append('mode', mode);
  formData.append('language', language);

  try {
    const response = await api.post('/report/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      if (error.response.status === 401) throw new Error('Session expired. Please log in again.');
      throw new Error(error.response.data.error || 'Failed to analyze report.');
    }
    throw new Error('Network error or server is down.');
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/report/history');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) throw new Error('Session expired. Please log in again.');
    throw new Error('Failed to fetch history.');
  }
};
