import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// User service
export const userService = {
  getProfile: async (username) => {
    const response = await api.get(`${API_ENDPOINTS.USERS.PROFILE}/${username}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE, userData);
    return response.data;
  }
};

// Post service
export const postService = {
  getAllPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POSTS.ALL);
    return response.data;
  },

  createPost: async (content) => {
    const response = await api.post(API_ENDPOINTS.POSTS.CREATE, { content });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`${API_ENDPOINTS.POSTS.DELETE}/${postId}`);
    return response.data;
  }
};

export default api;