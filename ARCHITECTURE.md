# Twitter Clone - Architecture Documentation

## 🏗️ System Architecture

This project implements a **clean layered architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React + MobX State Management + React Router               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │→ │ Templates  │→ │ Components │            │
│  └─────┬──────┘  └────────────┘  └────────────┘            │
│        ↓                                                      │
│  ┌────────────┐  ┌────────────┐                             │
│  │   Hooks    │→ │   Stores   │                             │
│  └────────────┘  └─────┬──────┘                             │
│                        ↓                                      │
│                  ┌────────────┐                              │
│                  │ API Service│                              │
│                  └─────┬──────┘                              │
└────────────────────────┼─────────────────────────────────────┘
                         ↓ HTTP/REST
┌────────────────────────┼─────────────────────────────────────┐
│                        ↓          BACKEND                     │
│                  ┌────────────┐                              │
│                  │   Routes   │ (Express Router)             │
│                  └─────┬──────┘                              │
│                        ↓                                      │
│                  ┌────────────┐                              │
│                  │Controllers │ (HTTP handlers)              │
│                  └─────┬──────┘                              │
│                        ↓                                      │
│                  ┌────────────┐                              │
│                  │  Services  │ (Business logic)             │
│                  └─────┬──────┘                              │
│                        ↓                                      │
│                  ┌────────────┐                              │
│                  │Repositories│ (Data access)                │
│                  └─────┬──────┘                              │
└────────────────────────┼─────────────────────────────────────┘
                         ↓ SQL
┌────────────────────────┼─────────────────────────────────────┐
│                        ↓         DATABASE                     │
│                  MySQL 8.0                                    │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐           │
│  │  users  │ │  posts  │ │ comments │ │ likes  │           │
│  └─────────┘ └─────────┘ └──────────┘ └────────┘           │
└──────────────────────────────────────────────────────────────┘
```

## 📁 Frontend Structure (MobX Pattern)

```
frontend/src/
├── stores/                    # 🔥 MobX State Management
│   ├── RootStore.js          # Singleton container for all stores
│   ├── AuthStore.js          # Authentication & user session
│   ├── PostStore.js          # Posts CRUD & state
│   ├── CommentStore.js       # Comments management
│   ├── LikeStore.js          # Likes with optimistic updates
│   ├── UserStore.js          # User profiles
│   └── NotificationStore.js  # Notifications (future)
│
├── hooks/                     # Custom React Hooks
│   ├── useStores.js          # Store access hooks
│   ├── useHomeLogic.js       # Business logic for HomePage
│   ├── useDashboardLogic.js  # Business logic for Dashboard
│   └── useProfileLogic.js    # Business logic for Profile
│
├── templates/                 # Presentational Components (observer)
│   ├── HomeTemplate.jsx
│   ├── DashboardTemplate.jsx
│   └── ProfileTemplate.jsx
│
├── pages/                     # Container Components
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   └── ProfilePage.jsx
│
├── components/                # Reusable UI Components
│   ├── Auth/                 # Authentication components
│   ├── Layout/               # Layout components
│   ├── Post/                 # Post-related components
│   └── UI/                   # Generic UI components
│
└── services/                  # API Layer
    └── api.js                # Axios instance & API methods
```

### MobX Store Architecture

**Store Communication Pattern:**
```javascript
┌──────────────────────────────────────────────────┐
│               RootStore (Singleton)              │
│  - Holds all store instances                     │
│  - Provides cross-store access                   │
│  - Created once in index.js                      │
└──────────────────┬───────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┐
        ↓          ↓          ↓          ↓          ↓
  ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐
  │  Auth   │ │  Post  │ │Comment  │ │  Like  │ │   User   │
  │  Store  │ │ Store  │ │ Store   │ │ Store  │ │  Store   │
  └─────────┘ └────────┘ └────┬────┘ └────────┘ └──────────┘
                               │
                               ↓
                    Updates PostStore.posts[]
                    (comments_count property)
```

**Example: CommentStore updates PostStore**
```javascript
// CommentStore.js
async addComment(postId, content) {
  const newComment = await api.addComment(postId, { content });
  
  // Update local comments
  this.commentsByPost.set(postId, [...comments, newComment]);
  
  // Update PostStore via RootStore
  this.rootStore.postStore.updatePostCommentCount(postId, 1);
  // ↑ This triggers automatic re-render in all observer() components!
}
```

## 📁 Backend Structure (Layered Pattern)

```
backend/
├── src/
│   ├── controllers/        # HTTP request handling
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── PostController.js
│   │   └── index.js
│   │
│   ├── services/          # Business logic layer
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── PostService.js
│   │   └── index.js
│   │
│   ├── repositories/      # Database access layer
│   │   ├── BaseRepository.js
│   │   ├── UserRepository.js
│   │   ├── PostRepository.js
│   │   ├── LikeRepository.js
│   │   ├── FollowRepository.js
│   │   └── index.js
│   │
│   ├── middleware/        # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   │
│   ├── routes/           # API route definitions
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── posts.js
│   │
│   └── config/           # Configuration files
│       ├── database.js
│       └── jwt.js
│
├── server.js             # Express app setup
└── package.json
```

## 🔄 Data Flow

### 1. Request Flow
```
HTTP Request → Route → Validation → Controller → Service → Repository → Database
```

### 2. Response Flow  
```
Database → Repository → Service → Controller → JSON Response
```

### 3. Example Flow for Creating a Post:

1. **Route**: `POST /api/posts`
2. **Middleware**: `auth` + `createPostValidation`
3. **Controller**: `PostController.createPost()`
4. **Service**: `PostService.createPost()` - validates business rules
5. **Repository**: `PostRepository.create()` - writes to database
6. **Response**: JSON with created post

## 🛡️ Error Handling

### Centralized Error Handling

All errors are handled centrally in `errorHandler.js`:

```javascript
// Automatic error mapping to HTTP status codes
400 - Validation errors
401 - Authentication errors  
403 - Permission errors
404 - Not found errors
409 - Conflict errors (duplicates)
500 - Internal server errors
```

### Standardized Response Format

```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error response
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // for validation errors
}
```

## ✅ Input Validation

Uses `express-validator` with predefined validation rules:

### Auth validations:
- `registerValidation` - username, email, password format
- `loginValidation` - email and password required  
- `changePasswordValidation` - current and new password

### User validations:
- `updateProfileValidation` - profile fields format
- `idValidation` - numeric ID validation
- `paginationValidation` - page/limit validation

### Post validations:
- `createPostValidation` - content length, image URL
- `updatePostValidation` - same as create
- `searchValidation` - search term format

## 🗄️ Repository Pattern

### BaseRepository
General CRUD operations inherited by all repositories:
- `findById(id)`
- `findAll(limit, offset)`
- `create(data)`
- `update(id, data)`
- `delete(id)`
- `executeQuery(query, params)`

### Specific Repositories

**UserRepository**:
- `findByEmail()`, `findByUsername()`
- `getFollowers()`, `getFollowing()`
- `searchUsers()`, `updateCounters()`

**PostRepository**:
- `getFeedPosts()`, `getUserPosts()`
- `getPostWithUser()`, `updateCounters()`
- `searchPosts()`

**LikeRepository**:
- `likePost()`, `unlikePost()`
- `isPostLikedByUser()`, `getPostLikes()`

**FollowRepository**:
- `followUser()`, `unfollowUser()`
- `isFollowing()`, `getFollowSuggestions()`

## 🔧 Services Layer

### AuthService
- Registration and authentication
- Password hashing with bcrypt
- JWT token generation and verification
- Input validation for auth operations

### UserService  
- User profile management
- Follow/unfollow logic
- Search and suggestions algorithms
- Counter updates

### PostService
- CRUD operations for posts
- Feed generation (posts from users you follow)
- Like/unlike logic with counter updates
- Search through post content

## 🚀 Architecture Benefits

### ✅ **Separation of Concerns**
Each layer has a clear responsibility:
- Controllers: HTTP handling
- Services: Business logic  
- Repositories: Data access

### ✅ **Testability**
Easy testing because layers are independent:
```javascript
// Mock repository in service test
const mockUserRepo = { findById: jest.fn() };
const userService = new UserService(mockUserRepo);
```

### ✅ **Maintainability**  
- Easy to add new features
- Changes in one layer don't affect others
- Clear structure for new developers

### ✅ **Reusability**
- BaseRepository is used in all repositories
- Validation rules are shared between routes
- Service logic can be used outside HTTP context

### ✅ **Error Handling**
- Centralized error processing
- Consistent error responses
- Automatic HTTP status mapping

## 📝 MVP API Endpoints

### Authentication
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login  
GET  /api/auth/verify       - Token verification
PUT  /api/auth/change-password - Password change
POST /api/auth/logout       - Logout
```

### Users
```
GET  /api/users/me          - Current user profile
PUT  /api/users/me          - Update profile
GET  /api/users/:id         - User profile by ID
POST /api/users/:id/follow  - Follow user
DEL  /api/users/:id/follow  - Unfollow user
GET  /api/users/:id/followers - User followers
GET  /api/users/:id/following - User following
GET  /api/users/search/users  - Search users
```

### Posts  
```
POST /api/posts             - Create post
GET  /api/posts/timeline    - Public timeline
GET  /api/posts/feed        - User feed (following)
GET  /api/posts/:id         - Get post by ID
PUT  /api/posts/:id         - Update post
DEL  /api/posts/:id         - Delete post
POST /api/posts/:id/like    - Like post
DEL  /api/posts/:id/like    - Unlike post
GET  /api/posts/user/:userId - User posts
GET  /api/posts/search      - Search posts
```

## 🎯 Next Steps

1. **Database setup**: Run MySQL and execute schema.sql
2. **Environment variables**: Create .env file
3. **Testing**: Add unit and integration tests
4. **Frontend integration**: Connect with React application
5. **Features**: Add comments, notifications, real-time updates