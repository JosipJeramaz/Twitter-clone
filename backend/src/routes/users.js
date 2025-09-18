const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const [users] = await db.execute(
      `SELECT id, username, email, full_name, bio, location, website, 
              followers_count, following_count, posts_count, created_at 
       FROM users WHERE username = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('full_name').optional().trim().escape(),
  body('bio').optional().trim(),
  body('location').optional().trim().escape(),
  body('website').optional().isURL().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { full_name, bio, location, website } = req.body;
    const userId = req.user.userId;

    await db.execute(
      `UPDATE users SET full_name = ?, bio = ?, location = ?, website = ?, 
       updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [full_name || null, bio || null, location || null, website || null, userId]
    );

    // Get updated user
    const [users] = await db.execute(
      `SELECT id, username, email, full_name, bio, location, website, 
              followers_count, following_count, posts_count, created_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: users[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;