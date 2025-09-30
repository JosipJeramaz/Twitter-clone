import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';

export const EditProfileTemplate = ({
  user,
  formData,
  loading,
  error,
  success,
  onChange,
  onSubmit,
  onCancel
}) => {
  // ESC key listener for closing modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  if (!user) {
    return (
      <div className="edit-profile-error">
        <p>Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-overlay" onClick={handleOverlayClick}>
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <h1>Edit Profile</h1>
          <p>Make changes to your public profile information</p>
        </div>
        
        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="edit-profile-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={onChange}
                placeholder="Enter your full name"
                maxLength={100}
              />
              <small className="form-hint">
                {formData.full_name.length}/100 characters
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows="4"
                maxLength={160}
                placeholder="Tell us about yourself..."
                className="bio-textarea"
              />
              <small className="form-hint">
                {formData.bio.length}/160 characters
              </small>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={onChange}
                placeholder="Where are you located?"
                maxLength={100}
              />
              <small className="form-hint">
                {formData.location.length}/100 characters
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <Input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={onChange}
                placeholder="https://yourwebsite.com"
                maxLength={255}
              />
              <small className="form-hint">
                Include http:// or https://
              </small>
            </div>
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};