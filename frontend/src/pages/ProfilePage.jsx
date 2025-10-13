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
    isFollowing,
    handleDeletePost,
    handleLikePost,
    handleFollowUser,
    handleUnfollowUser
  } = useProfileLogic();

  return (
    <ProfileTemplate
      loading={loading}
      error={error}
      profile={profile}
      username={username}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      onDeletePost={handleDeletePost}
      onLikePost={handleLikePost}
      onFollowUser={handleFollowUser}
      onUnfollowUser={handleUnfollowUser}
    />
  );
};

export default ProfilePage;