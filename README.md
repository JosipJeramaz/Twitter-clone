# Twitter Clone

A full-stack Twitter clone built with React, Node.js, Express, MySQL, and MobX for state management.

## 🚀 Features

### Implemented ✅
- ✅ User registration and authentication (JWT)
- ✅ OAuth authentication (Google & Apple Sign In)
- ✅ User profiles with custom usernames
- ✅ Post creation, v5. **Install and run backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

6. **Install and run frontend**and deletion
- ✅ Like/Unlike posts with optimistic updates
- ✅ Comments system (add, view, delete)
- ✅ Real-time UI updates using MobX
- ✅ Responsive dark theme design
- ✅ Protected routes and authentication middleware

### Planned Features 🚧
- [ ] Follow/unfollow system
- [ ] Real-time notifications
- [ ] Image uploads for posts and profiles
- [ ] Advanced search and filtering
- [ ] Hashtags and mentions
- [ ] Direct messaging

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM v6
- MobX 6 (State Management)
- mobx-react-lite (React bindings)
- Axios (HTTP client)
- CSS3 (Dark theme design)

**Backend:**
- Node.js
- Express.js
- MySQL 8
- JWT Authentication
- Bcrypt (Password hashing)
- Multer (File uploads)
- Winston (Logging)

**Architecture:**
- Dependency Injection Container (DIContainer)
- Repository Pattern (Data access layer)
- Service Layer (Business logic)
- Controller Layer (HTTP handlers)
- MobX Stores (Frontend state management)

**DevOps:**
- Docker & Docker Compose
- Environment-based configuration
- Nodemon (Development hot-reload)

## 📁 Project Structure

```
twitter-clone/
├── frontend/                     # React application
│   ├── public/
│   │   ├── index.html           # HTML template
│   │   └── manifest.json        # PWA manifest
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Auth/           # Authentication components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Layout/         # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── Post/           # Post-related components
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── CommentForm.jsx
│   │   │   │   └── CommentList.jsx
│   │   │   └── UI/             # Generic UI components
│   │   │       ├── Button.jsx
│   │   │       └── Input.jsx
│   │   ├── pages/              # Page components (containers)
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── templates/          # Template components (presentational)
│   │   │   ├── HomeTemplate.jsx
│   │   │   ├── DashboardTemplate.jsx
│   │   │   ├── ProfileTemplate.jsx
│   │   │   └── EditProfileTemplate.jsx
│   │   ├── stores/             # 🔥 MobX State Management
│   │   │   ├── RootStore.js    # Root store (singleton)
│   │   │   ├── AuthStore.js    # Authentication state
│   │   │   ├── PostStore.js    # Posts CRUD & state
│   │   │   ├── CommentStore.js # Comments management
│   │   │   ├── LikeStore.js    # Likes with optimistic updates
│   │   │   ├── UserStore.js    # User profiles & follow
│   │   │   └── NotificationStore.js # Notifications (future)
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useStores.js    # MobX store hooks (useAuthStore, etc.)
│   │   │   ├── useHomeLogic.js
│   │   │   ├── useDashboardLogic.js
│   │   │   ├── useProfileLogic.js
│   │   │   └── useEditProfileLogic.js
│   │   ├── services/           # API communication layer
│   │   │   └── api.js          # Axios instance & API methods
│   │   ├── constants/          # App-wide constants
│   │   │   └── index.js
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx             # Main App component
│   │   ├── App.css             # Global styles
│   │   └── index.js            # Entry point
│   └── package.json
│
├── backend/                      # Node.js Express API
│   ├── src/
│   │   ├── controllers/         # 🎯 HTTP Request Handlers
│   │   │   ├── index.js        # Controller exports
│   │   │   ├── AuthController.js
│   │   │   ├── UserController.js
│   │   │   ├── PostController.js
│   │   │   └── CommentController.js
│   │   ├── services/            # 💼 Business Logic Layer
│   │   │   ├── index.js        # Service exports
│   │   │   ├── AuthService.js
│   │   │   ├── UserService.js
│   │   │   ├── PostService.js
│   │   │   └── CommentService.js
│   │   ├── repositories/        # 🗄️ Data Access Layer
│   │   │   ├── index.js        # Repository exports
│   │   │   ├── BaseRepository.js
│   │   │   ├── UserRepository.js
│   │   │   ├── PostRepository.js
│   │   │   ├── CommentRepository.js
│   │   │   ├── LikeRepository.js
│   │   │   └── FollowRepository.js
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js         # JWT authentication & optionalAuth
│   │   │   ├── validation.js   # Request validation
│   │   │   └── errorHandler.js # Global error handler
│   │   ├── routes/              # 🛣️ API Route definitions
│   │   │   ├── auth.js         # /api/auth/*
│   │   │   ├── users.js        # /api/users/*
│   │   │   └── posts.js        # /api/posts/*
│   │   ├── config/              # Configuration files
│   │   │   ├── database.js     # MySQL connection pool
│   │   │   ├── jwt.js          # JWT configuration
│   │   │   └── dependencies.js # DI Container setup
│   │   ├── models/              # (Future) Data models/schemas
│   │   └── utils/               # Utility functions
│   │       └── DIContainer.js  # Dependency Injection Container
│   ├── uploads/                 # User-uploaded files
│   ├── logs/                    # Application logs (Winston)
│   ├── server.js                # Entry point & Express setup
│   └── package.json
│
├── database/                     # SQL Scripts
│   ├── schema.sql               # Database schema (tables, indexes)
│   ├── seed.sql                 # Sample data for testing
│   └── update_schema.sql        # Schema migrations/updates
│
├── docker-compose.yml           # Docker services configuration
├── ARCHITECTURE.md              # Architecture documentation
├── DATABASE_SETUP.md            # Database setup guide
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## 🏗️ Architecture Overview

### Frontend Architecture (MobX Pattern)

**Component Hierarchy:**
```
App.jsx
 ├── Layout.jsx (Header + Sidebar)
 │    ├── Header.jsx
 │    └── Sidebar.jsx
 │
 ├── Pages (Containers)
 │    ├── HomePage → HomeTemplate
 │    ├── DashboardPage → DashboardTemplate
 │    ├── ProfilePage → ProfileTemplate
 │    └── EditProfilePage → EditProfileTemplate
 │
 └── Components (Reusable)
      ├── Auth/ (Login, Register, ProtectedRoute)
      ├── Post/ (PostCard, CommentForm, CommentList)
      └── UI/ (Button, Input)
```

**State Management Flow:**
```
User Action (Click like button)
       ↓
Event Handler (handleLikePost)
       ↓
MobX Store Action (likeStore.toggleLike)
       ↓
Observable Change (likeStore.userLikes.add(postId))
       ↓
MobX Magic ✨ (Detects change)
       ↓
Re-render Observer Components (DashboardTemplate)
       ↓
UI Updates Instantly! 🎉
```

**MobX Store Communication:**
```
┌─────────────┐
│  RootStore  │ (Singleton, holds all stores)
└──────┬──────┘
       │
       ├─── AuthStore ────────┐
       ├─── PostStore ────────┼─── Cross-store access
       ├─── CommentStore ─────┤    via rootStore
       ├─── LikeStore ────────┤
       ├─── UserStore ────────┤
       └─── NotificationStore ┘

Example: CommentStore updates PostStore.posts[].comments_count
```

**Key Patterns:**
1. **Stores** - Centralized state management with MobX observables
2. **Custom Hooks** - Business logic separated from UI (useStores, useHomeLogic, etc.)
3. **Templates** - Presentational components wrapped with `observer()`
4. **Pages** - Container components that use hooks and pass data to templates

**MobX Store Responsibilities:**
- **RootStore** - Singleton that holds all stores and provides cross-store access
- **AuthStore** - User authentication state, login/logout, token management
- **PostStore** - Posts array (observable), CRUD operations, global post updates
- **LikeStore** - Optimistic like/unlike with Map & Set for fast lookups
- **CommentStore** - Comments by post (Map), automatically updates PostStore.comments_count
- **UserStore** - User profiles, follow/unfollow (future)
- **NotificationStore** - Real-time notifications (future)

### Backend Architecture (Layered Pattern)

**Request Flow:**
```
Client Request
    ↓
Express Route (/api/posts)
    ↓
Controller (PostController.createPost)
    ↓
Service Layer (PostService.createPost) - Business Logic
    ↓
Repository (PostRepository.create) - Data Access
    ↓
MySQL Database
```

**Key Patterns:**
1. **Dependency Injection** - DIContainer manages service instances
2. **Repository Pattern** - Abstracts database operations
3. **Service Layer** - Business logic separated from HTTP handlers
4. **Middleware** - Authentication, validation, error handling

### Database Schema

**Main Tables:**
- `users` - User accounts (id, username, email, password_hash, full_name, bio, etc.)
- `posts` - User posts (id, user_id, content, created_at, likes_count, comments_count)
- `comments` - Post comments (id, post_id, user_id, content, created_at)
- `likes` - Post likes (post_id, user_id, created_at) - Composite PK
- `followers` - Follow relationships (follower_id, followed_id, created_at)

**Indexes:**
- User lookup: `username`, `email`
- Post queries: `user_id`, `created_at`
- Like checks: `(post_id, user_id)`
- Comments: `post_id`, `user_id`

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd twitter-clone
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Configure OAuth (Optional)**
   - See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed OAuth configuration
   - Required for Google and Apple Sign In features

4. **Set up the database**
   ```bash
   # Create database and run schema
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   mysql -u root -p < database/add_oauth_support.sql
   ```

5. **Install and run backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. **Install and run frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Docker Development

1. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

This will start all services (MySQL, Backend, Frontend) automatically.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  - Body: `{ username, email, password, full_name? }`
  - Returns: JWT token + user data
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: JWT token + user data
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/apple` - Initiate Apple OAuth login
- `POST /api/auth/apple/callback` - Apple OAuth callback
- `POST /api/auth/logout` - Logout user (clears token)

### User Endpoints
- `GET /api/users/profile/:username` - Get user profile by username
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update current user profile (authenticated)
  - Body: `{ full_name?, bio?, location?, website? }`

### Post Endpoints
- `GET /api/posts` - Get timeline posts (all posts, sorted by date)
  - Query: `?limit=20&offset=0`
- `GET /api/posts/user/:userId` - Get posts by specific user
- `POST /api/posts` - Create new post (authenticated)
  - Body: `{ content }`
- `DELETE /api/posts/:id` - Delete own post (authenticated)

### Like Endpoints
- `POST /api/posts/:id/like` - Like a post (authenticated)
- `DELETE /api/posts/:id/like` - Unlike a post (authenticated)
- Note: Like status included in post objects (`is_liked` boolean)

### Comment Endpoints
- `GET /api/posts/:id/comments` - Get comments for a post
  - Query: `?limit=50&offset=0`
  - Returns: Comments sorted chronologically (oldest first)
- `POST /api/posts/:id/comments` - Add comment to post (authenticated)
  - Body: `{ content }`
- `DELETE /api/comments/:id` - Delete own comment (authenticated)

### Response Format
All endpoints return JSON in format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev mode only)"
}
```

## 🧪 Testing

### Manual Testing
Test accounts are seeded in the database:
- **User 1:** `peroo11` / `password123`
- **User 2:** `johndoe` / `password123`

### Features to Test
1. **Authentication:**
   - Register new account
   - Login/Logout
   - Protected routes redirect to login

2. **Posts:**
   - Create post (max 280 characters)
   - View timeline
   - Delete own posts
   - View user profile posts

3. **Likes:**
   - Like/unlike posts
   - See like count update instantly (optimistic)
   - Like status persists after refresh

4. **Comments:**
   - Add comment to post
   - View comments (oldest first)
   - Delete own comments
   - Comment count updates automatically via MobX

### Backend Tests
```bash
cd backend
npm test  # (Future: Unit tests for services/repositories)
```

### Frontend Tests
```bash
cd frontend
npm test  # (Future: React component tests)
```

## 🎓 Learning Resources & Key Concepts

### MobX State Management
This project uses **MobX 6** with the following patterns:

**1. Observable Stores:**
```javascript
class PostStore {
  posts = [];  // Observable array
  
  constructor(rootStore) {
    makeAutoObservable(this);  // Makes all properties observable
  }
  
  updatePostCommentCount(postId, delta) {
    this.posts = this.posts.map(post => 
      post.id === postId 
        ? { ...post, comments_count: post.comments_count + delta }
        : post
    );
    // MobX automatically detects change and re-renders observers
  }
}
```

**2. Observer Components:**
```javascript
export const DashboardTemplate = observer(({ user }) => {
  const postStore = usePostStore();  // Get store via hook
  const posts = postStore.posts;      // Access observable directly
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          {post.content}
          <span>{post.comments_count}</span>  {/* Auto-updates! */}
        </div>
      ))}
    </div>
  );
});
```

**3. Custom Hooks for Stores:**
```javascript
// useStores.js
export const usePostStore = () => {
  return useContext(StoreContext).postStore;
};

export const useAuthStore = () => {
  return useContext(StoreContext).authStore;
};
```

### Why MobX vs Redux?
- ✅ Less boilerplate (no actions, reducers, dispatching)
- ✅ Automatic re-renders (no need to manually subscribe)
- ✅ Direct mutations in actions (wrapped in `runInAction`)
- ✅ Better for complex nested state
- ❌ Less predictable than Redux (implicit updates)

### Repository Pattern (Backend)
Separates data access logic from business logic:

```javascript
// PostRepository.js - Data Access
class PostRepository {
  async findAll(limit, offset) {
    const [rows] = await db.execute(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}

// PostService.js - Business Logic
class PostService {
  constructor(postRepository, likeRepository) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
  }
  
  async getTimelinePosts(userId, limit, offset) {
    const posts = await this.postRepository.findAll(limit, offset);
    // Add like status for current user
    return posts.map(post => ({
      ...post,
      is_liked: await this.likeRepository.isLikedByUser(post.id, userId)
    }));
  }
}
```

### Dependency Injection Container
Manages service instances and their dependencies:

```javascript
// DIContainer.js
class DIContainer {
  constructor() {
    this.services = {};
  }
  
  register(name, factory) {
    this.services[name] = factory(this);
  }
  
  get(name) {
    return this.services[name];
  }
}

// dependencies.js
container.register('postRepository', () => new PostRepository(db));
container.register('postService', (c) => 
  new PostService(c.get('postRepository'), c.get('likeRepository'))
);
```

## 🐛 Common Issues & Solutions

### Frontend Issues

**Issue:** "Posts not updating after comment added"
- **Cause:** Template not wrapped with `observer()` or not using store directly
- **Solution:** Ensure template uses `const postStore = usePostStore()` and is wrapped with `observer()`

**Issue:** "Likes not persisting after refresh"
- **Cause:** Backend returning `0/1` instead of boolean
- **Solution:** Convert in repository: `is_liked: !!row.is_liked`

**Issue:** "Authentication token lost on refresh"
- **Cause:** Token stored in memory only
- **Solution:** Store in `localStorage` and restore in AuthStore initialization

### Backend Issues

**Issue:** "optionalAuth middleware error"
- **Cause:** Wrong user object structure
- **Solution:** Ensure `req.user = { id: decoded.userId }` in middleware

**Issue:** "CORS errors in development"
- **Solution:** Check `FRONTEND_URL` in `.env` and CORS middleware setup

**Issue:** "Database connection pool exhausted"
- **Solution:** Ensure connections are released: use `db.execute()` instead of `db.query()`

## 🚀 Deployment

### Production Build

1. **Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend**
   ```bash
   cd backend
   npm start
   ```

### Environment Variables

**Backend (.env):**
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=twitter_clone

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

**Production Notes:**
- ⚠️ Change `JWT_SECRET` to a strong random string
- ⚠️ Set `NODE_ENV=production`
- ⚠️ Update `FRONTEND_URL` to your domain
- ⚠️ Use HTTPS in production
- ⚠️ Set up proper MySQL user with limited permissions
- ⚠️ Configure reverse proxy (nginx) for backend

## 📄 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture and design decisions
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database setup and migration guide