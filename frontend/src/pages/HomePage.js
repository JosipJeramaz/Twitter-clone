import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { APP_NAME, ROUTES } from '../constants';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <div className="home-hero">
            <h1 className="home-title">{APP_NAME}</h1>
            <p className="home-subtitle">
              Connect with friends and the world around you on {APP_NAME}.
            </p>
          </div>

          <div className="home-actions">
            <div className="action-card">
              <h2>New to {APP_NAME}?</h2>
              <p>Sign up now to get your own personalized timeline!</p>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="large" fullWidth>
                  Create account
                </Button>
              </Link>
            </div>

            <div className="action-card">
              <h2>Already have an account?</h2>
              <p>Sign in to see what's happening in your world.</p>
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary" size="large" fullWidth>
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">📱</div>
            <h3>Follow your interests</h3>
            <p>Hear about what matters to you</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">👥</div>
            <h3>Connect with people</h3>
            <p>Find and follow interesting people</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">💬</div>
            <h3>Join the conversation</h3>
            <p>Share your thoughts with the world</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;