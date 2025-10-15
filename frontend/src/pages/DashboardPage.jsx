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
    feedFilter,
    handlePostChange,
    handleCreatePost,
    handleDeletePost,
    handleLikePost,
    handleFilterChange
  } = useDashboardLogic();

  return (
    <DashboardTemplate
      user={user}
      loading={loading}
      newPost={newPost}
      posting={posting}
      feedFilter={feedFilter}
      onPostChange={handlePostChange}
      onCreatePost={handleCreatePost}
      onDeletePost={handleDeletePost}
      onLikePost={handleLikePost}
      onFilterChange={handleFilterChange}
    />
  );
};

export default DashboardPage;