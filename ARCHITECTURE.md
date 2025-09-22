# Twitter Clone - Clean Architecture Implementation

## 🏗️ Arhitektura

Implementiran je **clean architecture** pattern sa jasno razdvojenim slojevima:

```
┌─────────────────┐
│   Controllers   │ ← HTTP zahtevi, validacija input-a
├─────────────────┤
│    Services     │ ← Poslovna logika, pravila aplikacije  
├─────────────────┤
│  Repositories   │ ← Database operacije, data access
├─────────────────┤
│    Database     │ ← MySQL tabele i podaci
└─────────────────┘
```

## 📁 Struktura backend-a

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

### 3. Primer flow-a za kreiranje posta:

1. **Route**: `POST /api/posts`
2. **Middleware**: `auth` + `createPostValidation`
3. **Controller**: `PostController.createPost()`
4. **Service**: `PostService.createPost()` - validira business rules
5. **Repository**: `PostRepository.create()` - upisuje u bazu
6. **Response**: JSON sa kreiranim postom

## 🛡️ Error Handling

### Centralized Error Handling

Sve greške se obrađuju centralno u `errorHandler.js`:

```javascript
// Automatsko mapiranje grešaka na HTTP status kodove
400 - Validation errors
401 - Authentication errors  
403 - Permission errors
404 - Not found errors
409 - Conflict errors (duplicates)
500 - Internal server errors
```

### Standardizovan Response Format

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
  "errors": [ ... ] // za validation errors
}
```

## ✅ Input Validation

Koristi se `express-validator` sa predefinisanim validation rules:

### Auth validations:
- `registerValidation` - username, email, password format
- `loginValidation` - email i password required  
- `changePasswordValidation` - trenutna i nova lozinka

### User validations:
- `updateProfileValidation` - profile fields format
- `idValidation` - numeric ID validation
- `paginationValidation` - page/limit validation

### Post validations:
- `createPostValidation` - content length, image URL
- `updatePostValidation` - isti kao create
- `searchValidation` - search term format

## 🗄️ Repository Pattern

### BaseRepository
Opšte CRUD operacije koje nasleđuju svi repository-ji:
- `findById(id)`
- `findAll(limit, offset)`
- `create(data)`
- `update(id, data)`
- `delete(id)`
- `executeQuery(query, params)`

### Specifični Repository-ji

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
- Registracija i autentifikacija
- Password hashing sa bcrypt
- JWT token generisanje i verifikacija
- Input validacija za auth operacije

### UserService  
- Upravljanje korisničkim profilima
- Follow/unfollow logika
- Search i suggestions algoritmi
- Counter updates

### PostService
- CRUD operacije za postove
- Feed generisanje (posts od onih koje pratiš)
- Like/unlike logika sa counter updates
- Search kroz sadržaj postova

## 🚀 Prednosti ove arhitekture

### ✅ **Separation of Concerns**
Svaki sloj ima jasnu odgovornost:
- Controllers: HTTP handling
- Services: Business logic  
- Repositories: Data access

### ✅ **Testability**
Lako testiranje jer su slojevi nezavisni:
```javascript
// Mock repository u service testu
const mockUserRepo = { findById: jest.fn() };
const userService = new UserService(mockUserRepo);
```

### ✅ **Maintainability**  
- Lako dodavanje novih funkcionalnosti
- Izmene u jednom sloju ne utiču na druge
- Jasna struktura za nove developere

### ✅ **Reusability**
- BaseRepository se koristi u svim repository-jima
- Validation rules se dele između routes
- Service logika se može koristiti van HTTP context-a

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

## 🎯 Sledeći koraci

1. **Database setup**: Pokretanje MySQL i izvršavanje schema.sql
2. **Environment variables**: Kreiranje .env fajla
3. **Testing**: Dodavanje unit i integration testova
4. **Frontend integration**: Povezivanje sa React aplikacijom
5. **Features**: Dodavanje comments, notifications, real-time updates