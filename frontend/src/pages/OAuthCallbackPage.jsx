import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../hooks/useStores';
import { ROUTES } from '../constants';
import './OAuthCallbackPage.css';

const OAuthCallbackPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStore = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const errorParam = params.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setTimeout(() => navigate(ROUTES.LOGIN), 3000);
          return;
        }

        if (!token) {
          setError('No authentication token received');
          setTimeout(() => navigate(ROUTES.LOGIN), 3000);
          return;
        }

        // Handle OAuth login with token
        await authStore.handleOAuthCallback(token);
        
        // Redirect to dashboard on success
        navigate(ROUTES.DASHBOARD);
      } catch (err) {
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate(ROUTES.LOGIN), 3000);
      }
    };

    handleOAuthCallback();
  }, [location, navigate, authStore]);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-content">
        {error ? (
          <>
            <div className="oauth-callback-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2"/>
              </svg>
            </div>
            <h2>Authentication Failed</h2>
            <p className="error-message">{error}</p>
            <p className="redirect-message">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="oauth-callback-icon loading">
              <svg className="spinner" viewBox="0 0 24 24">
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeDasharray="32"
                  strokeDashoffset="32"
                />
              </svg>
            </div>
            <h2>Completing Authentication</h2>
            <p>Please wait while we sign you in...</p>
          </>
        )}
      </div>
    </div>
  );
});

export default OAuthCallbackPage;
