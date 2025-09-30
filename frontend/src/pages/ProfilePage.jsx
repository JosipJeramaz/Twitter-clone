import React from 'react';
import { ProfileTemplate } from '../templates/ProfileTemplate.jsx';
import { useProfileLogic } from '../hooks/useProfileLogic.js';
import './ProfilePage.css';

/**
 * ProfilePage component - main container for user profile
 */
const ProfilePage = () => {
  const {
    profile,
    posts,
    loading,
    error,
    username,
    isOwnProfile,
    handleDeletePost
  } = useProfileLogic();

  return (
    <ProfileTemplate
      loading={loading}
      error={error}
      profile={profile}
      posts={posts}
      username={username}
      isOwnProfile={isOwnProfile}
      onDeletePost={handleDeletePost}
    />
  );
};

export default ProfilePage;