import React from 'react';
import { EditProfileTemplate } from '../templates/EditProfileTemplate.jsx';
import { useEditProfileLogic } from '../hooks/useEditProfileLogic.js';
import './EditProfilePage.css';

/**
 * EditProfilePage component - main container for profile editing
 */
const EditProfilePage = () => {
  const {
    user,
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleCancel
  } = useEditProfileLogic();

  return (
    <EditProfileTemplate
      user={user}
      formData={formData}
      loading={loading}
      error={error}
      success={success}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditProfilePage;