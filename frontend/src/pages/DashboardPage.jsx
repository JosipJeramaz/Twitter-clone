import React from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate.jsx';
import { useDashboardLogic } from '../hooks/useDashboardLogic.js';
import './DashboardPage.css';

/**
 * DashboardPage component - main page with timeline
 */
const DashboardPage = () => {
  const {
    newPost,
    loading,
    posting,
    user,
    handlePostChange,
    handleCreatePost,
    handleDeletePost,
    handleLikePost
  } = useDashboardLogic();

  return (
    <DashboardTemplate
      user={user}
      loading={loading}
      newPost={newPost}
      posting={posting}
      onPostChange={handlePostChange}
      onCreatePost={handleCreatePost}
      onDeletePost={handleDeletePost}
      onLikePost={handleLikePost}
    />
  );
};

export default DashboardPage;