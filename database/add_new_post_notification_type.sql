-- Add 'new_post' notification type
USE twitter_clone;

-- Modify the ENUM to include 'new_post'
ALTER TABLE notifications 
MODIFY COLUMN type ENUM('like', 'comment', 'follow', 'mention', 'new_post') NOT NULL;

-- Verify the change
DESCRIBE notifications;
