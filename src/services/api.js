import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token if it exists
api.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('token');
  if (!token) {
    token = localStorage.getItem('token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/user/login', { email, password });
  return response.data.body.token;
};

export const getProfile = async () => {
  const response = await api.post('/user/profile');
  return response.data.body;
};

export const updateProfile = async (firstName, lastName) => {
  const response = await api.put('/user/profile', { firstName, lastName });
  return response.data.body;
};

export default api;
