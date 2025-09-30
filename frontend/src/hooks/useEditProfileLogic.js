import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/api';

/**
 * Custom hook for managing Edit Profile logic
 */
export const useEditProfileLogic = (onClose = null) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Form validation - only checks format, doesn't require completeness
   */
  const validateForm = () => {
    // Check website only if entered
    if (formData.website && formData.website.trim() && !isValidUrl(formData.website)) {
      setError('Please enter a valid website URL');
      return false;
    }
    
    // Check length only if content is entered
    if (formData.bio && formData.bio.length > 160) {
      setError('Bio must be 160 characters or less');
      return false;
    }
    
    if (formData.full_name && formData.full_name.length > 100) {
      setError('Full name must be 100 characters or less');
      return false;
    }
    
    if (formData.location && formData.location.length > 100) {
      setError('Location must be 100 characters or less');
      return false;
    }
    
    return true;
  };

  /**
   * URL validation
   */
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  /**
   * Submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        website: formData.website || null
      };

      const response = await userService.updateProfile(updateData);
      
      console.log('🔍 Full API response:', response);
      
      // Show success message
      if (response.data?.user || response.user) {
        setSuccess('Profile updated successfully!');
        console.log('🎉 Profile updated, navigating to:', `/profile/${user.username}`);
        console.log('📝 User object:', user);
        console.log('📝 onClose callback:', onClose);
        
        // Navigate immediately
        if (onClose) {
          onClose(); // Close modal if callback is provided
        } else {
          navigate(`/profile/${user.username}`); // Otherwise navigate to profile
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    if (onClose) {
      onClose(); // Close modal if callback is provided
    } else {
      navigate(`/profile/${user?.username}`); // Otherwise navigate to profile
    }
  };

  /**
   * Reset form to original values
   */
  const resetForm = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
    setError('');
    setSuccess('');
  };

  return {
    // State
    user,
    formData,
    loading,
    error,
    success,
    
    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm,
    
    // Utilities
    validateForm,
    isValidUrl
  };
};