import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import { APP_NAME, ROUTES } from '../../constants';
import NotificationBell from './NotificationBell';
import './Header.css';

const Header = observer(() => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

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
          <h1 className="logo">{APP_NAME}</h1>
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