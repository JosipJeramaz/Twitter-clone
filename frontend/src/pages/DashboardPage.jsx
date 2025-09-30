import React from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate.jsx';
import { useDashboardLogic } from '../hooks/useDashboardLogic.js';
import './DashboardPage.css';

/**
 * DashboardPage component - main page with timeline
 */
const DashboardPage = () => {
  const {
    posts,
    newPost,
    loading,
    posting,
    user,
    handlePostChange,
    handleCreatePost,
    handleDeletePost
  } = useDashboardLogic();

  return (
    <DashboardTemplate
      user={user}
      loading={loading}
      posts={posts}
      newPost={newPost}
      posting={posting}
      onPostChange={handlePostChange}
      onCreatePost={handleCreatePost}
      onDeletePost={handleDeletePost}
    />
  );
};

export default DashboardPage;