// API base URL
// For mobile access, use your computer's IP address instead of localhost
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.0.139:5000/api';

// WebSocket URL (for real-time notifications)
// Use ws:// for development, wss:// for production with SSL
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://192.168.0.139:5000';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update'
  },
  POSTS: {
    ALL: '/posts',
    CREATE: '/posts',
    DELETE: '/posts'
  }
};

// App constants
export const APP_NAME = 'Twitter Clone';
export const MAX_TWEET_LENGTH = 280;
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
};