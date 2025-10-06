import React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '../../hooks/useStores';
import './ProtectedRoute.css';

const ProtectedRoute = observer(({ children }) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
});

export default ProtectedRoute;