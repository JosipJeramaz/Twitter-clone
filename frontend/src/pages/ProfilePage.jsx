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
    loading,
    error,
    username,
    isOwnProfile,
    handleDeletePost,
    handleLikePost
  } = useProfileLogic();

  return (
    <ProfileTemplate
      loading={loading}
      error={error}
      profile={profile}
      username={username}
      isOwnProfile={isOwnProfile}
      onDeletePost={handleDeletePost}
      onLikePost={handleLikePost}
    />
  );
};

export default ProfilePage;