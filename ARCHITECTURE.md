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
┌────────────────────────┼─────────────────────────────────────┘
                         ↓ SQL
┌────────────────────────┼─────────────────────────────────────┐
│                        ↓         DATABASE                     │
│                  MySQL 8.0                                    │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐           │
│  │  users  │ │  posts  │ │ comments │ │ likes  │           │
│  └─────────┘ └─────────┘ └──────────┘ └────────┘           │
│  ┌─────────┐ ┌──────────────┐                               │
│  │ follows │ │notifications │                               │
│  └─────────┘ └──────────────┘                               │
└──────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema

### Tables Overview

```
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password_hash
├── full_name
├── bio
├── profile_picture
├── oauth_provider (google/apple)
├── oauth_id
├── followers_count
├── following_count
├── created_at
└── updated_at

posts
├── id (PK)
├── user_id (FK → users.id)
├── content
├── image_url
├── likes_count
├── comments_count
├── created_at
└── updated_at

comments
├── id (PK)
├── post_id (FK → posts.id)
├── user_id (FK → users.id)
├── content
├── created_at
└── updated_at

likes
├── id (PK)
├── post_id (FK → posts.id)
├── user_id (FK → users.id)
└── created_at
└── UNIQUE(post_id, user_id)

follows
├── id (PK)
├── follower_id (FK → users.id)
├── following_id (FK → users.id)
├── created_at
└── UNIQUE(follower_id, following_id)

notifications
├── id (PK)
├── user_id (FK → users.id)
├── actor_id (FK → users.id)
├── type (follow/like/comment/new_post)
├── post_id (FK → posts.id, nullable)
├── comment_id (FK → comments.id, nullable)
├── message
├── is_read
├── created_at
└── updated_at
```

### Key Relationships

- **users → posts**: One-to-Many (user can have many posts)
- **users → comments**: One-to-Many (user can make many comments)
- **posts → comments**: One-to-Many (post can have many comments)
- **users ↔ users (follows)**: Many-to-Many (users can follow each other)
- **users + posts → likes**: Many-to-Many (users can like many posts)
- **users → notifications**: One-to-Many (user receives many notifications)

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
│   └── NotificationStore.js  # Real-time notifications & WebSocket
│
├── hooks/                     # Custom React Hooks
│   ├── useStores.js          # Store access hooks
│   ├── useHomeLogic.js       # Business logic for HomePage
│   ├── useDashboardLogic.js  # Business logic for Dashboard
│   ├── useProfileLogic.js    # Business logic for Profile
│   └── useEditProfileLogic.js # Business logic for Edit Profile
│
├── templates/                 # Presentational Components (observer)
│   ├── HomeTemplate.jsx
│   ├── DashboardTemplate.jsx
│   ├── ProfileTemplate.jsx
│   └── EditProfileTemplate.jsx
│
├── pages/                     # Container Components
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── EditProfilePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── OAuthCallbackPage.jsx
│
├── components/                # Reusable UI Components
│   ├── Auth/                 # Authentication components
│   ├── Layout/               # Layout components (Header, Sidebar, NotificationBell)
│   ├── Post/                 # Post-related components (PostCard, CommentForm, etc.)
│   └── UI/                   # Generic UI components (Button, Input)
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
        ┌──────────┼──────────┬──────────┬──────────┬─────────────┐
        ↓          ↓          ↓          ↓          ↓             ↓
  ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
  │  Auth   │ │  Post  │ │Comment  │ │  Like  │ │   User   │ │Notification  │
  │  Store  │ │ Store  │ │ Store   │ │ Store  │ │  Store   │ │    Store     │
  └─────────┘ └────────┘ └────┬────┘ └────────┘ └──────────┘ └──────┬───────┘
                               │                                      │
                               ↓                                      ↓
                    Updates PostStore.posts[]            WebSocket connection
                    (comments_count property)            Real-time notifications
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

**Example: NotificationStore with WebSocket**
```javascript
// NotificationStore.js
connectWebSocket() {
  const token = this.rootStore.authStore.token;
  const wsUrl = `ws://localhost:5000/ws/notifications?token=${token}`;
  
  this.ws = new WebSocket(wsUrl);
  
  this.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'notification') {
      // Add notification to store
      this.addNotification(data.notification);
      // Automatically updates UI via MobX reactivity
    }
  };
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
│   │   ├── CommentController.js
│   │   ├── NotificationController.js
│   │   └── index.js
│   │
│   ├── services/          # Business logic layer
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── PostService.js
│   │   ├── CommentService.js
│   │   ├── NotificationService.js
│   │   ├── WebSocketService.js
│   │   └── index.js
│   │
│   ├── repositories/      # Database access layer
│   │   ├── BaseRepository.js
│   │   ├── UserRepository.js
│   │   ├── PostRepository.js
│   │   ├── CommentRepository.js
│   │   ├── LikeRepository.js
│   │   ├── FollowRepository.js
│   │   ├── NotificationRepository.js
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
│   │   ├── posts.js
│   │   └── notifications.js
│   │
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── passport.js
│   │   └── dependencies.js
│   │
│   └── utils/            # Utility classes
│       └── DIContainer.js
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

**CommentRepository**:
- `getPostComments()`, `createComment()`
- `deleteComment()`, `updateCommentCount()`

**NotificationRepository**:
- `getUserNotifications()`, `createNotification()`
- `markAsRead()`, `markAllAsRead()`
- `getUnreadCount()`, `deleteNotification()`

## 🔧 Services Layer

### AuthService
- Registration and authentication
- Password hashing with bcrypt
- JWT token generation and verification
- **OAuth authentication (Google & Apple)**
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

### CommentService
- CRUD operations for comments
- Comment pagination
- Comment count updates
- Notification triggers on new comments

### NotificationService
- Create and manage notifications
- Mark notifications as read
- Get unread count
- Real-time notification delivery via WebSocket

### WebSocketService
- Manages WebSocket connections
- JWT authentication via query parameter
- Real-time notification broadcasting
- Client connection lifecycle management
- Supports events: notifications, new posts, likes

## 🔌 Real-time Communication

### WebSocket Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│  ┌───────────────────────────────────────────────┐ │
│  │     NotificationStore (MobX)                  │ │
│  │  - Establishes WebSocket connection           │ │
│  │  - Listens for real-time events               │ │
│  │  - Updates observable state automatically     │ │
│  └─────────────────┬─────────────────────────────┘ │
└────────────────────┼───────────────────────────────┘
                     │ WebSocket
                     │ ws://backend/ws/notifications?token=JWT
                     ↓
┌────────────────────┼───────────────────────────────┐
│                    ↓       Backend                  │
│  ┌───────────────────────────────────────────────┐ │
│  │     WebSocketService                          │ │
│  │  - Authenticates via JWT token                │ │
│  │  - Maintains userId → WebSocket mapping       │ │
│  │  - Broadcasts to specific users               │ │
│  └─────────────────┬─────────────────────────────┘ │
│                    ↓                                │
│  ┌───────────────────────────────────────────────┐ │
│  │  NotificationService / PostService            │ │
│  │  - Triggers WebSocket broadcasts              │ │
│  │  - webSocketService.sendToUser(userId, data)  │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### WebSocket Events

**Connection:**
- `connected` - Sent when client successfully connects
- `error` - Connection or authentication errors

**Notifications:**
- `notification` - New notification (follow, like, comment, new post)
- `unread_count` - Updated unread notification count

**Real-time Updates:**
- `new_post` - User you follow created a post
- `post_liked` - Your post received a like
- `post_commented` - Your post received a comment

### WebSocket Authentication Flow

```javascript
// 1. Frontend establishes connection with JWT
const token = authStore.token;
const ws = new WebSocket(`ws://backend/ws/notifications?token=${token}`);

// 2. Backend verifies JWT
const decoded = jwt.verify(token, JWT_SECRET);
const userId = decoded.userId;

// 3. Store connection mapping
clients.set(userId, ws);

// 4. Send to specific user
sendToUser(userId, { type: 'notification', data: {...} });
```

## 🔐 OAuth Authentication

### Supported Providers
- **Google OAuth 2.0**
- **Apple Sign In**

### OAuth Flow

```
1. User clicks "Sign in with Google/Apple"
2. Frontend redirects to: GET /api/auth/google (or /apple)
3. User authenticates with OAuth provider
4. Provider redirects back to: GET /api/auth/google/callback
5. Backend receives OAuth profile data
6. AuthService.handleOAuthLogin():
   - Finds existing user by provider ID
   - OR creates new user with OAuth data
7. Backend generates JWT token
8. Redirects to frontend: /oauth-callback?token=JWT
9. Frontend stores token and redirects to home
```

### OAuth Configuration

**Passport.js strategies configured in `config/passport.js`:**
- Checks environment variables for credentials
- Only enables providers if properly configured
- Gracefully handles missing configuration

**Environment variables required:**
```env
# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Apple OAuth
APPLE_CLIENT_ID=...
APPLE_TEAM_ID=...
APPLE_KEY_ID=...
APPLE_PRIVATE_KEY_PATH=...
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback
```

### UserRepository OAuth Methods
- `findByOAuthId(provider, providerId)` - Find user by OAuth ID
- `findOrCreateOAuthUser(oauthProfile)` - Create or update OAuth user
- Stores: `oauth_provider`, `oauth_id`, `oauth_email`, `oauth_picture`

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
GET  /api/auth/google       - Google OAuth login
GET  /api/auth/google/callback - Google OAuth callback
GET  /api/auth/apple        - Apple OAuth login
GET  /api/auth/apple/callback - Apple OAuth callback
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
GET  /api/posts/:id/comments - Get post comments
POST /api/posts/:id/comments - Add comment
DEL  /api/posts/:id/comments/:commentId - Delete comment
GET  /api/posts/user/:userId - User posts
GET  /api/posts/search      - Search posts
```

### Notifications
```
GET  /api/notifications     - Get user notifications
POST /api/notifications/:id/read - Mark as read
POST /api/notifications/read-all - Mark all as read
GET  /api/notifications/unread-count - Get unread count
DEL  /api/notifications/:id - Delete notification
```

### WebSocket
```
WS   /ws/notifications?token=JWT - Real-time notification stream
```

## 🎯 Implemented Features

✅ **Authentication & Authorization**
- User registration and login
- JWT token-based authentication
- OAuth integration (Google & Apple)
- Protected routes and middleware

✅ **User Management**
- User profiles with bio and avatar
- Follow/Unfollow functionality
- Followers and following lists
- User search

✅ **Posts & Feed**
- Create, read, update, delete posts
- Timeline (all posts) and Feed (following only)
- Like/Unlike posts
- Post search

✅ **Comments**
- Add comments to posts
- View post comments with pagination
- Delete own comments
- Comment count tracking

✅ **Notifications**
- Real-time notifications via WebSocket
- Notification types: follow, like, comment, new_post
- Mark as read functionality
- Unread count badge
- Persistent storage in database

✅ **Real-time Features**
- WebSocket connection with JWT auth
- Live notification delivery
- Automatic UI updates via MobX

✅ **Architecture Patterns**
- Layered architecture (Routes → Controllers → Services → Repositories)
- Dependency Injection with DIContainer
- MobX state management on frontend
- Separation of concerns throughout

## 🚀 Future Enhancements

- [ ] Direct messaging between users
- [ ] Image upload for posts and avatars
- [ ] Video support
- [ ] Hashtags and trending topics
- [ ] User mentions (@username)
- [ ] Retweet functionality
- [ ] Quote tweets
- [ ] Bookmarks/saved posts
- [ ] Email notifications
- [ ] Push notifications (PWA)
- [ ] Advanced search filters
- [ ] User verification badges
- [ ] Analytics dashboard
- [ ] Rate limiting per user
- [ ] Content moderation tools

---

**Last Updated:** October 2025  
**Status:** Production Ready ✅