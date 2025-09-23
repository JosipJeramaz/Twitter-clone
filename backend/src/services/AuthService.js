const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(userRepository) {
    if (!userRepository) {
      throw new Error('UserRepository is required for AuthService');
    }
    this.userRepository = userRepository;
  }

  // Register new user
  async register(userData) {
    const { username, email, password, full_name } = userData;

    try {
      // Check if user already exists
      const existingUserByEmail = await this.userRepository.findByEmail(email);
      if (existingUserByEmail) {
        throw new Error('User with this email already exists');
      }

      const existingUserByUsername = await this.userRepository.findByUsername(username);
      if (existingUserByUsername) {
        throw new Error('Username already taken');
      }

      // Validate input
      this.validateUserInput({ username, email, password, full_name });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await this.userRepository.create({
        username,
        email,
        password: hashedPassword,
        full_name
      });

      // Generate JWT token
      const token = this.generateToken(newUser.id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.userRepository.update(userId, {
        password: hashedNewPassword
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Validate user input
  validateUserInput({ username, email, password, full_name }) {
    // Username validation
    if (!username || username.length < 3 || username.length > 50) {
      throw new Error('Username must be between 3 and 50 characters');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please provide a valid email address');
    }

    // Password validation
    this.validatePassword(password);

    // Full name validation
    if (!full_name || full_name.trim().length < 1) {
      throw new Error('Full name is required');
    }

    if (full_name.length > 100) {
      throw new Error('Full name must not exceed 100 characters');
    }
  }

  // Validate password
  validatePassword(password) {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (password.length > 128) {
      throw new Error('Password must not exceed 128 characters');
    }

    // Check for at least one letter and one number
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one letter and one number');
    }
  }
}

module.exports = AuthService;