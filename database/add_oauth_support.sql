-- Add OAuth support to users table
-- Run this after running schema.sql

ALTER TABLE users
ADD COLUMN google_id VARCHAR(255) UNIQUE,
ADD COLUMN apple_id VARCHAR(255) UNIQUE,
ADD COLUMN oauth_provider ENUM('local', 'google', 'apple') DEFAULT 'local',
ADD COLUMN profile_picture VARCHAR(500);

-- Add indexes for OAuth lookup
CREATE INDEX idx_google_id ON users(google_id);
CREATE INDEX idx_apple_id ON users(apple_id);

-- Make password optional for OAuth users
ALTER TABLE users
MODIFY COLUMN password VARCHAR(255) NULL;

-- Update existing users to have 'local' provider
UPDATE users SET oauth_provider = 'local' WHERE oauth_provider IS NULL;
