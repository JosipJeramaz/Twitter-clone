import { useMemo } from 'react';
import { APP_NAME, ROUTES } from '../constants';

/**
 * Custom hook for HomePage logic (simple static page)
 */
export const useHomeLogic = () => {
  // Static data for features
  const features = useMemo(() => [
    {
      icon: '📱',
      title: 'Follow your interests',
      description: 'Hear about what matters to you'
    },
    {
      icon: '👥',
      title: 'Connect with people', 
      description: 'Find and follow interesting people'
    },
    {
      icon: '💬',
      title: 'Join the conversation',
      description: 'Share your thoughts with the world'
    }
  ], []);

  return {
    appName: APP_NAME,
    routes: ROUTES,
    features
  };
};