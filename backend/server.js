const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { configureDependencies } = require('./src/config/dependencies');
const { initializePassport, passport } = require('./src/config/passport');
const createAuthRoutes = require('./src/routes/auth');
const createUserRoutes = require('./src/routes/users');
const createPostRoutes = require('./src/routes/posts');
const createNotificationRoutes = require('./src/routes/notifications');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const webSocketService = require('./src/services/WebSocketService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Trust proxy (required for rate limiting behind proxies)
app.set('trust proxy', 1);

// Configure dependency injection
const container = configureDependencies();

// Initialize Passport for OAuth
initializePassport();
app.use(passport.initialize());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting (development settings)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/auth', createAuthRoutes(container));
app.use('/api/users', createUserRoutes(container));
app.use('/api/posts', createPostRoutes(container));
app.use('/api/notifications', createNotificationRoutes(container));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Twitter Clone API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Initialize WebSocket server
webSocketService.initialize(server);

// Make webSocketService available globally for services
global.webSocketService = webSocketService;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📡 WebSocket server ready at ws://localhost:${PORT}/ws/notifications`);
});