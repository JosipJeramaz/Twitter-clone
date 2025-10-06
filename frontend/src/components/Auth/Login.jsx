import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import Button from '../UI/Button.jsx';
import Input from '../UI/Input.jsx';
import { ROUTES } from '../../constants';
import './Auth.css';

const Login = observer(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.login(formData.email, formData.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error is handled in AuthStore
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign in to Twitter Clone</h2>
        
        {authStore.error && (
          <div className="error-message">
            {authStore.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={authStore.loading}
          >
            Sign in
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? {' '}
            <Link to={ROUTES.REGISTER} className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Login;