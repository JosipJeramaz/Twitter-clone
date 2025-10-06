const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Invalid token format' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Token expired' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Token verification failed' 
    });
  }
};

// Optional auth middleware - doesn't fail if no token is provided
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.headers.authorization;
    
    if (!authHeader) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // ✅ Match the format from auth middleware
    next();
  } catch (error) {
    // If token is invalid, continue without user info instead of failing
    req.user = null;
    next();
  }
};

module.exports = auth;
module.exports.optionalAuth = optionalAuth;