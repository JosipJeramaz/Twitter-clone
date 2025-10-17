# 🐦 Twitter Clone

Full-stack Twitter clone application with real-time functionality, OAuth authentication, and modern architectural principles.

## 🚀 Technologies

### Backend
- **Node.js** + **Express.js** - REST API
- **MySQL 8.0** - Relational database
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication
- **Passport.js** - OAuth (Google, Apple)
- **Bcrypt** - Password hashing
- **Helmet** + **Rate Limiting** - Security

### Frontend
- **React 18** - UI framework
- **MobX** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **WebSocket API** - Real-time updates

### DevOps
- **Docker** + **Docker Compose** - Containerization
- **MySQL Volume** - Data persistence

## ✨ Features

### Authentication
- ✅ Registration and login
- ✅ OAuth (Google & Apple Sign-In)
- ✅ JWT token authentication
- ✅ Protected routes

### Posts
- ✅ Create posts (text + images)
- ✅ View feed
- ✅ Like/Unlike posts
- ✅ Delete own posts
- ✅ Real-time updates

### Comments
- ✅ Comment on posts
- ✅ View comments
- ✅ Delete own comments

### Users
- ✅ User profiles
- ✅ Follow/Unfollow functionality
- ✅ Update profile (bio, avatar)
- ✅ View followers and following list

### Notifications
- ✅ Real-time notifications
- ✅ Notifications for: follow, like, comment, new post
- ✅ Mark as read
- ✅ Notification bell with badge

### Dashboard
- ✅ View followed users
- ✅ Statistics (followers/following count)

## 📂 Project Structure

```
twitter-clone/
│
├── backend/                          # Node.js API Server
│   ├── src/
│   │   ├── config/                   # Configuration (DB, JWT, Passport)
│   │   ├── controllers/              # HTTP request handlers
│   │   │   ├── AuthController.js
│   │   │   ├── PostController.js
│   │   │   ├── UserController.js
│   │   │   ├── CommentController.js
│   │   │   └── NotificationController.js
│   │   ├── services/                 # Business logic
│   │   │   ├── AuthService.js
│   │   │   ├── PostService.js
│   │   │   ├── UserService.js
│   │   │   ├── CommentService.js
│   │   │   ├── NotificationService.js
│   │   │   └── WebSocketService.js
│   │   ├── repositories/             # Data access layer
│   │   │   ├── UserRepository.js
│   │   │   ├── PostRepository.js
│   │   │   ├── CommentRepository.js
│   │   │   ├── LikeRepository.js
│   │   │   ├── FollowRepository.js
│   │   │   └── NotificationRepository.js
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── routes/                   # API routing
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   ├── users.js
│   │   │   └── notifications.js
│   │   └── utils/
│   │       └── DIContainer.js        # Dependency Injection
│   ├── server.js                     # Entry point
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── stores/                   # MobX State Management
│   │   │   ├── RootStore.js          # Root store (singleton)
│   │   │   ├── AuthStore.js
│   │   │   ├── PostStore.js
│   │   │   ├── CommentStore.js
│   │   │   ├── LikeStore.js
│   │   │   ├── UserStore.js
│   │   │   └── NotificationStore.js
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── OAuthCallbackPage.jsx
│   │   ├── templates/                # Presentational templates
│   │   │   ├── HomeTemplate.jsx
│   │   │   ├── ProfileTemplate.jsx
│   │   │   ├── DashboardTemplate.jsx
│   │   │   └── EditProfileTemplate.jsx
│   │   ├── components/               # Reusable components
│   │   │   ├── Auth/                 # Login, Register, ProtectedRoute
│   │   │   ├── Layout/               # Header, Sidebar, NotificationBell
│   │   │   ├── Post/                 # PostCard, PostForm, CommentForm
│   │   │   └── UI/                   # Button, Input, Modal...
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useStores.js
│   │   │   ├── useHomeLogic.js
│   │   │   ├── useDashboardLogic.js
│   │   │   ├── useProfileLogic.js
│   │   │   └── useEditProfileLogic.js
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── constants/
│   │   │   └── index.js              # API URLs and constants
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── database/                         # MySQL schema and seed
│   ├── schema.sql                    # Initial schema
│   ├── add_oauth_support.sql         # OAuth migration
│   ├── update_schema.sql             # Update migrations
│   ├── add_new_post_notification_type.sql
│   └── seed.sql                      # Test data
│
├── docker-compose.yml                # Docker orchestration
└── ARCHITECTURE.md                   # Detailed architecture

```

## 🏗️ Architecture

### Backend - Layered Architecture
```
Routes → Controllers → Services → Repositories → Database
```

- **Routes**: Define API endpoints
- **Controllers**: Process HTTP requests/responses
- **Services**: Implement business logic
- **Repositories**: Access database
- **Middleware**: Authentication, validation, error handling

### Frontend - MobX Pattern
```
Pages → Hooks (useLogic) → Stores (MobX) → API Service
         ↓
     Templates (Presentational) → Components
```

- **Stores**: Centralized state (observable)
- **Hooks**: Business logic for page components
- **Templates**: Presentational components (observer)
- **Pages**: Container components connecting everything

### Real-time Communication
- **Native WebSocket (ws)** for bidirectional communication
- WebSocket server on `/ws/notifications` endpoint
- JWT authentication via query parameter
- Events: new posts, notifications, like actions
- WebSocketService on backend, NotificationStore on frontend

## 🐳 Running the Project

### Prerequisites
- Docker & Docker Compose installed
- Ports 3000 (frontend), 5000 (backend), 3306 (MySQL) available

### 1. Start Docker containers

```bash
docker-compose up -d
```

This starts:
- MySQL database on port `3306`
- Backend API on port `5000`
- Frontend on port `3000`

### 2. Access the application

Open browser: **http://localhost:3000**

### 3. Test account

If seed.sql was executed:
- Email: `john@example.com`
- Password: `password123`

### 4. Stop containers

```bash
docker-compose down
```

### 5. Complete removal (including database)

```bash
docker-compose down -v
```

## 📦 Development without Docker

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### MySQL
Run MySQL and execute SQL files from `database/` folder in order.

## 🔒 Environment Variables

Backend `.env` file (or docker-compose.yml):
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=twitter_user
DB_PASSWORD=twitter_password
DB_NAME=twitter_clone
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 🤝 OAuth Setup (Optional)

For Google and Apple OAuth:
1. Create OAuth applications (Google Console / Apple Developer)
2. Add credentials to backend `.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
```

## 📄 License

MIT

---

**Built with ❤️ as a demo project**
