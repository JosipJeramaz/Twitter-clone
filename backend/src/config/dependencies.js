const DIContainer = require('../utils/DIContainer');

// Import repositories
const { 
  UserRepository, 
  PostRepository, 
  LikeRepository, 
  FollowRepository 
} = require('../repositories');

// Import services
const { 
  AuthService, 
  UserService, 
  PostService 
} = require('../services');

// Import controllers
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');

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

  // Register services as singletons with their dependencies
  container.registerSingleton('authService', (container) => 
    new AuthService(
      container.resolve('userRepository')
    )
  );

  container.registerSingleton('userService', (container) => 
    new UserService(
      container.resolve('userRepository'),
      container.resolve('followRepository')
    )
  );

  container.registerSingleton('postService', (container) => 
    new PostService(
      container.resolve('postRepository'),
      container.resolve('likeRepository'),
      container.resolve('userRepository')
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

  return container;
}

module.exports = { configureDependencies };