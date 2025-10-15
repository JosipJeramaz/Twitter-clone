const DIContainer = require('../utils/DIContainer');

// Import repositories
const { 
  UserRepository, 
  PostRepository, 
  LikeRepository, 
  FollowRepository 
} = require('../repositories');
const CommentRepository = require('../repositories/CommentRepository');
const NotificationRepository = require('../repositories/NotificationRepository');

// Import services
const { 
  AuthService, 
  UserService, 
  PostService 
} = require('../services');
const CommentService = require('../services/CommentService');
const NotificationService = require('../services/NotificationService');

// Import controllers
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');
const CommentController = require('../controllers/CommentController');
const NotificationController = require('../controllers/NotificationController');

/**
 * Configure and register all dependencies
 * @returns {DIContainer} Configured DI container
 */
function configureDependencies() {
  const container = new DIContainer();

  // Register repositories as singletons
  container.registerSingleton('userRepository', () => new UserRepository());
  container.registerSingleton('postRepository', () => new PostRepository());
  container.registerSingleton('likeRepository', () => new LikeRepository());
  container.registerSingleton('followRepository', () => new FollowRepository());
  container.registerSingleton('commentRepository', () => new CommentRepository());
  container.registerSingleton('notificationRepository', () => new NotificationRepository());

  // Register services as singletons with their dependencies
  container.registerSingleton('authService', (container) => 
    new AuthService(
      container.resolve('userRepository')
    )
  );

  container.registerSingleton('userService', (container) => 
    new UserService(
      container.resolve('userRepository'),
      container.resolve('followRepository'),
      container.resolve('notificationService')
    )
  );

  container.registerSingleton('postService', (container) => 
    new PostService(
      container.resolve('postRepository'),
      container.resolve('likeRepository'),
      container.resolve('userRepository'),
      container.resolve('notificationService'),
      container.resolve('followRepository')
    )
  );

  container.registerSingleton('commentService', (container) => 
    new CommentService(
      container.resolve('commentRepository'),
      container.resolve('postRepository'),
      container.resolve('notificationService')
    )
  );

  container.registerSingleton('notificationService', (container) => 
    new NotificationService(
      container.resolve('notificationRepository')
    )
  );

  // Register controllers as singletons with their dependencies
  container.registerSingleton('authController', (container) => 
    new AuthController(container.resolve('authService'))
  );

  container.registerSingleton('userController', (container) => 
    new UserController(container.resolve('userService'))
  );

  container.registerSingleton('postController', (container) => 
    new PostController(container.resolve('postService'))
  );

  container.registerSingleton('commentController', (container) => 
    new CommentController(container.resolve('commentService'))
  );

  container.registerSingleton('notificationController', (container) => 
    new NotificationController(container.resolve('notificationService'))
  );

  return container;
}

module.exports = { configureDependencies };