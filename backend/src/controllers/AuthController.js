class AuthController {
  constructor(authService) {
    if (!authService) {
      throw new Error('AuthService is required for AuthController');
    }
    this.authService = authService;
  }

  // Register new user
  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Login user
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await this.authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Verify token
  verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const user = await this.authService.verifyToken(token);
      
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  };

  // Change password
  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      const result = await this.authService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout (client-side handles token removal)
  logout = async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  };
}

module.exports = AuthController;