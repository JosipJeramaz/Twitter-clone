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

// Configure CORS to allow mobile access
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    // Allow any origin in development that's not from a suspicious domain
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📡 WebSocket server ready at ws://0.0.0.0:${PORT}/ws/notifications`);
  console.log(`📱 Server accessible from network at: http://0.0.0.0:${PORT}`);
  console.log(`💡 To access from mobile, use your computer's IP address (e.g., http://192.168.x.x:${PORT})`);
});