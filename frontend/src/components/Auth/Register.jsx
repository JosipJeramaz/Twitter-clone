import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import Button from '../UI/Button.jsx';
import Input from '../UI/Input.jsx';
import { ROUTES } from '../../constants';
import './Auth.css';

const Register = observer(() => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [validationError, setValidationError] = useState('');
  const authStore = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [authStore.isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (authStore.error) authStore.clearError();
    if (validationError) setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (formData.username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...userData } = formData;
      await authStore.register(userData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error is handled in AuthStore
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/apple`;
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Join Twitter Clone today</h2>
        
        {(authStore.error || validationError) && (
          <div className="error-message">
            {authStore.error || validationError}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="oauth-buttons">
          <button 
            type="button" 
            className="oauth-btn google-btn"
            onClick={handleGoogleLogin}
            disabled={authStore.loading}
          >
            <svg className="oauth-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <button 
            type="button" 
            className="oauth-btn apple-btn"
            onClick={handleAppleLogin}
            disabled={authStore.loading}
          >
            <svg className="oauth-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Sign up with Apple
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={authStore.loading}
          >
            Create account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? {' '}
            <Link to={ROUTES.LOGIN} className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Register;