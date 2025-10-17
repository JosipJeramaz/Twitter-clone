import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import { APP_NAME, ROUTES } from '../../constants';
import NotificationBell from './NotificationBell';
import './Header.css';

const Header = observer(() => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authStore.logout();
      navigate(ROUTES.HOME);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo" onClick={() => navigate(ROUTES.DASHBOARD)} style={{ cursor: 'pointer' }}>
            {APP_NAME}
          </h1>
          
          {/* Navigation Menu */}
          {authStore.user && (
            <nav className="header-nav">
              <Link 
                to={ROUTES.DASHBOARD} 
                className={`header-nav-item ${location.pathname === ROUTES.DASHBOARD ? 'active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
              </Link>
              
              <Link 
                to={authStore.user?.username ? `/profile/${authStore.user.username}` : '/profile'} 
                className={`header-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Profile</span>
              </Link>
            </nav>
          )}
        </div>
        
        <div className="header-right">
          {authStore.user && (
            <div className="user-menu">
              <NotificationBell />
              <span className="username">@{authStore.user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;