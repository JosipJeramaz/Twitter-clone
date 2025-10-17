import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import { ROUTES } from '../../constants';
import './Sidebar.css';

const Sidebar = observer(() => {
  const location = useLocation();
  const authStore = useAuthStore();

  const menuItems = [
    { path: ROUTES.DASHBOARD, label: 'Home', icon: '🏠' },
    { 
      path: authStore.user?.username ? `/profile/${authStore.user.username}` : '/profile', 
      label: 'Profile', 
      icon: '👤',
      disabled: !authStore.user?.username
    },
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
});

export default Sidebar;