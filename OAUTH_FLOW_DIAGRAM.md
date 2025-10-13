# OAuth Flow Diagram

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GOOGLE/APPLE OAUTH FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐                                                    ┌──────────┐
│          │                                                    │          │
│  User    │                                                    │ Browser  │
│          │                                                    │          │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │ 1. Click "Sign in with Google/Apple"                         │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │ Frontend  │
     │                                                         │ React App │
     │                                                         │           │
     │                                                         └─────┬─────┘
     │                                                               │
     │                                                               │ 2. Redirect to
     │                                                               │    /api/auth/google
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │  Backend  │
     │                                                         │  Express  │
     │                                                         │  + Passport│
     │                                                         │           │
     │                                                         └─────┬─────┘
     │                                                               │
     │                                                               │ 3. Redirect to
     │                                                               │    OAuth Provider
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │  Google/  │
     │                                                         │  Apple    │
     │                                                         │  OAuth    │
     │                                                         │           │
     │                                                         └─────┬─────┘
     │                                                               │
     │ 4. Authenticate with Provider                                │
     ◄─────────────────────────────────────────────────────────────┤
     │                                                               │
     │ 5. User approves access                                      │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                                                               │ 6. Redirect with
     │                                                               │    auth code
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │  Backend  │
     │                                                         │  Callback │
     │                                                         │           │
     │                                                         └─────┬─────┘
     │                                                               │
     │                                                               │ 7. Exchange code
     │                                                               │    for profile
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │ Passport │
     │                                                         │ Strategy │
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 8. Verify profile
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │   User   │
     │                                                         │Repository│
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 9. Find or create
     │                                                               │    user in DB
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │  MySQL   │
     │                                                         │ Database │
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 10. User data
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │   Auth   │
     │                                                         │ Service  │
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 11. Generate JWT
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │   Auth   │
     │                                                         │Controller│
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 12. Redirect to
     │                                                               │     /oauth/callback
     │                                                               │     ?token=JWT
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │ Frontend  │
     │                                                         │ Callback  │
     │                                                         │   Page    │
     │                                                         │           │
     │                                                         └─────┬─────┘
     │                                                               │
     │                                                               │ 13. Extract token
     │                                                               │     from URL
     │                                                               ▼
     │                                                         ┌──────────┐
     │                                                         │   Auth   │
     │                                                         │  Store   │
     │                                                         └─────┬────┘
     │                                                               │
     │                                                               │ 14. Store token
     │                                                               │     in localStorage
     │                                                               │
     │                                                               │ 15. Verify token
     │                                                               │
     │                                                         ┌─────▼─────┐
     │                                                         │           │
     │                                                         │ Dashboard │
     │                                                         │   Page    │
     │ 16. Authenticated! Redirect to Dashboard                │           │
     ◄─────────────────────────────────────────────────────────┤           │
     │                                                         └───────────┘
     │
     ▼
```

## Database Operations

### User Lookup Flow:

```
┌─────────────────────────────────────────────────────────────┐
│            findOrCreateOAuthUser(oauthProfile)              │
└─────────────────────────────────────────────────────────────┘

  1. Check if OAuth ID exists
     ↓
     SELECT * FROM users WHERE google_id = ? OR apple_id = ?
     ↓
  ┌─────────────────┐
  │ User found?     │
  └────┬───────┬────┘
       │ YES   │ NO
       ↓       ↓
   Return   2. Check if email exists
   User        ↓
               SELECT * FROM users WHERE email = ?
               ↓
            ┌─────────────────┐
            │ Email found?    │
            └────┬───────┬────┘
                 │ YES   │ NO
                 ↓       ↓
              Link     3. Create new user
              Account     ↓
              by          INSERT INTO users (
              updating    username,
              OAuth ID    email,
                          google_id/apple_id,
                          oauth_provider,
                          profile_picture,
                          full_name
                         )
                          ↓
                       Generate unique username
                       from email or OAuth ID
                          ↓
                       Return new User
```

## Token Flow

```
┌──────────────┐
│ OAuth Login  │
└──────┬───────┘
       │
       │ User authenticated
       ↓
┌──────────────────┐
│ AuthService      │
│ handleOAuthLogin │
└──────┬───────────┘
       │
       │ Generate JWT Token
       ↓
┌──────────────────────────┐
│ jwt.sign({               │
│   userId: user.id,       │
│   email: user.email      │
│ }, JWT_SECRET, {         │
│   expiresIn: '7d'        │
│ })                       │
└──────┬───────────────────┘
       │
       │ JWT Token
       ↓
┌──────────────────┐
│ Frontend         │
│ receives token   │
│ in URL query     │
└──────┬───────────┘
       │
       │ Store in localStorage
       ↓
┌──────────────────┐
│ AuthStore        │
│ handleOAuth      │
│ Callback         │
└──────┬───────────┘
       │
       │ Verify token with backend
       ↓
┌──────────────────┐
│ GET /auth/verify │
│ Authorization:   │
│ Bearer <token>   │
└──────┬───────────┘
       │
       │ User data returned
       ↓
┌──────────────────┐
│ User authenticated│
│ in frontend      │
└──────────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                      │
└─────────────────────────────────────────────────────────────┘

Login.jsx / Register.jsx
         │
         │ handleGoogleLogin()
         │ handleAppleLogin()
         ↓
window.location.href = BACKEND_URL + '/api/auth/google'
         │
         ↓
      Backend
         │
         ↓
Passport Strategy authenticates
         │
         ↓
Backend redirects to:
FRONTEND_URL + '/oauth/callback?token=JWT'
         │
         ↓
OAuthCallbackPage.jsx
         │
         │ Extract token from URL
         │ const token = params.get('token')
         ↓
authStore.handleOAuthCallback(token)
         │
         │ Store token
         │ Verify with backend
         ↓
navigate(ROUTES.DASHBOARD)
         │
         ↓
DashboardPage.jsx (Authenticated)
```

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layers                           │
└─────────────────────────────────────────────────────────────┘

Routes (auth.js)
    ↓
GET /api/auth/google
    ↓
passport.authenticate('google', { scope: ['profile', 'email'] })
    ↓
Redirect to Google OAuth
    ↓
User authenticates
    ↓
GET /api/auth/google/callback?code=xxx
    ↓
passport.authenticate('google')
    ↓
GoogleStrategy verifies code
    ↓
Controller (AuthController.js)
    ↓
googleCallback(req, res)
    ↓
Service (AuthService.js)
    ↓
handleOAuthLogin(oauthProfile)
    ↓
Repository (UserRepository.js)
    ↓
findOrCreateOAuthUser(oauthProfile)
    ↓
Database (MySQL)
    ↓
User record created/found
    ↓
Generate JWT token
    ↓
Redirect to frontend with token
```

## State Management (MobX)

```
┌─────────────────────────────────────────────────────────────┐
│                    AuthStore State                          │
└─────────────────────────────────────────────────────────────┘

Initial State:
├── user: null
├── token: localStorage.getItem('token')
├── isAuthenticated: false
└── loading: true

OAuth Callback:
├── handleOAuthCallback(token)
│   ├── Store token in localStorage
│   ├── Verify token with backend
│   ├── Update user state
│   ├── Set isAuthenticated = true
│   └── Set loading = false

Authenticated State:
├── user: { id, username, email, ... }
├── token: "eyJhbGc..."
├── isAuthenticated: true
└── loading: false
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
└─────────────────────────────────────────────────────────────┘

1. OAuth Provider Authentication
   ├── User authenticates with Google/Apple
   ├── Provider validates credentials
   └── Provider issues auth code

2. Backend Verification
   ├── Passport exchanges code for profile
   ├── Validates profile data
   └── Checks provider signature

3. Database Security
   ├── Unique constraints on OAuth IDs
   ├── Indexed lookups for performance
   └── Email-based account linking

4. JWT Token Security
   ├── Signed with JWT_SECRET
   ├── 7-day expiration
   └── Contains minimal user data (id, email)

5. Frontend Protection
   ├── Token stored in localStorage
   ├── Included in Authorization header
   ├── Protected routes check authentication
   └── Token verified on app initialization
```

---

**Note:** This diagram shows the complete OAuth flow from user click to authenticated session. All components work together to provide a secure, seamless authentication experience.
