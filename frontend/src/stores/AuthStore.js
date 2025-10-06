// AuthStore.js - Login, register, logout, user state
import { makeAutoObservable, runInAction } from 'mobx';
import { authService } from '../services/api';

class AuthStore {
  user = null;
  token = localStorage.getItem('token') || null;
  isAuthenticated = !!localStorage.getItem('token');
  loading = !!localStorage.getItem('token'); // loading dok verifikujemo token
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    
    // Check if user is logged in on app start
    if (this.token) {
      this.verifyToken();
    }
  }

  // Verify token on app start
  async verifyToken() {
    try {
      const user = await authService.verifyToken();
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        localStorage.removeItem('token');
        this.token = null;
        this.isAuthenticated = false;
        this.loading = false;
      });
    }
  }

  // Login
  async login(email, password) {
    this.loading = true;
    this.error = null;

    try {
      const response = await authService.login(email, password);
      runInAction(() => {
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        this.loading = false;
        localStorage.setItem('token', response.token);
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Login failed';
        this.loading = false;
      });
      throw error;
    }
  }

  // Register
  async register(userData) {
    this.loading = true;
    this.error = null;

    try {
      const response = await authService.register(userData);
      runInAction(() => {
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;
        this.loading = false;
        localStorage.setItem('token', response.token);
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Registration failed';
        this.loading = false;
      });
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.loading = false;
    this.error = null;
  }

  // Clear error
  clearError() {
    this.error = null;
  }
}

export default AuthStore;
