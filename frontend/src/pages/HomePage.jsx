import React from 'react';
import { HomeTemplate } from '../templates/HomeTemplate.jsx';
import { useHomeLogic } from '../hooks/useHomeLogic.js';
import './HomePage.css';

/**
 * HomePage component - application landing page
 */
const HomePage = () => {
  const { appName, routes, features } = useHomeLogic();

  return (
    <HomeTemplate
      appName={appName}
      routes={routes}
      features={features}
    />
  );
};

export default HomePage;