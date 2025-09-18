-- Test data for Twitter Clone
-- Run this after schema.sql

USE twitter_clone;

-- Test users
INSERT INTO users (username, email, password, full_name, bio) VALUES
('john_doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'Software developer passionate about technology'),
('jane_smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 'Designer and creative thinker'),
('mike_wilson', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Wilson', 'Tech enthusiast and blogger');

-- Test posts
INSERT INTO posts (user_id, content) VALUES
(1, 'This is my first post on this Twitter clone! Excited to see how this works.'),
(2, 'Just finished an amazing design project. Can''t wait to share more details!'),
(1, 'Working on some new features. What would you like to see next?'),
(3, 'Learning React and Node.js has been an incredible journey. #coding #webdev'),
(2, 'Beautiful sunset today! Sometimes you need to take a break and enjoy nature.');

-- Test follows
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 1),
(3, 2);

-- Test likes
INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 2),
(4, 1),
(4, 2),
(5, 1);

-- Test comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Welcome to the platform! Great to have you here.'),
(1, 3, 'Looking forward to your future posts!'),
(2, 1, 'Can''t wait to see your design work!'),
(4, 2, 'React is amazing! Keep up the great work.');

-- Update counters (this would normally be done by triggers)
UPDATE users SET 
    followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = users.id),
    following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = users.id),
    posts_count = (SELECT COUNT(*) FROM posts WHERE user_id = users.id);

UPDATE posts SET 
    likes_count = (SELECT COUNT(*) FROM likes WHERE post_id = posts.id),
    comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = posts.id);