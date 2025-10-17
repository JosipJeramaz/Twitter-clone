import React from 'react';
import Header from './Header.jsx';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;