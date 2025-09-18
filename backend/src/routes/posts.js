const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.execute(
      `SELECT p.id, p.content, p.likes_count, p.comments_count, p.created_at,
              u.id as user_id, u.username, u.full_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT 50`
    );

    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create post
router.post('/', auth, [
  body('content').isLength({ min: 1, max: 280 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { content } = req.body;
    const userId = req.user.userId;

    // Create post
    const [result] = await db.execute(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [userId, content]
    );

    // Update user's post count
    await db.execute(
      'UPDATE users SET posts_count = posts_count + 1 WHERE id = ?',
      [userId]
    );

    // Get created post with user info
    const [posts] = await db.execute(
      `SELECT p.id, p.content, p.likes_count, p.comments_count, p.created_at,
              u.id as user_id, u.username, u.full_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Post created successfully',
      post: posts[0]
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Check if post exists and belongs to user
    const [posts] = await db.execute(
      'SELECT id, user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete post
    await db.execute('DELETE FROM posts WHERE id = ?', [postId]);

    // Update user's post count
    await db.execute(
      'UPDATE users SET posts_count = posts_count - 1 WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;