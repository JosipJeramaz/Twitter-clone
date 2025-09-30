import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';

export const HomeTemplate = ({ appName, routes, features }) => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <div className="home-hero">
            <h1 className="home-title">{appName}</h1>
            <p className="home-subtitle">
              Connect with friends and the world around you on {appName}.
            </p>
          </div>

          <div className="home-actions">
            <div className="action-card">
              <h2>New to {appName}?</h2>
              <p>Sign up now to get your own personalized timeline!</p>
              <Link to={routes.REGISTER}>
                <Button variant="primary" size="large" fullWidth>
                  Create account
                </Button>
              </Link>
            </div>

            <div className="action-card">
              <h2>Already have an account?</h2>
              <p>Sign in to see what's happening in your world.</p>
              <Link to={routes.LOGIN}>
                <Button variant="secondary" size="large" fullWidth>
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="home-features">
          {features.map((feature, index) => (
            <div key={index} className="feature">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};