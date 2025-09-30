import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: ROUTES.DASHBOARD, label: 'Home', icon: '🏠' },
    { 
      path: user?.username ? `/profile/${user.username}` : '/profile', 
      label: 'Profile', 
      icon: '👤',
      disabled: !user?.username
    },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/messages', label: 'Messages', icon: '💬' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          item.disabled ? (
            <div
              key={item.path}
              className="nav-item disabled"
              title="Loading user data..."
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;