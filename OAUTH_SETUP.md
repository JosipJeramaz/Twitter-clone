# OAuth Setup Guide

This guide explains how to set up Google and Apple OAuth authentication for the Twitter Clone application.

## Prerequisites

- Backend server running on `http://localhost:5000` (or your configured URL)
- Frontend app running on `http://localhost:3000` (or your configured URL)
- Database with OAuth support columns (run `database/add_oauth_support.sql`)

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - Add your app name, email, and logo
   - Add authorized domains (e.g., `localhost` for development)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Twitter Clone (or your app name)
   - Authorized redirect URIs:
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`

### 2. Configure Backend Environment Variables

Add to `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### 3. Test Google OAuth

1. Start backend server: `cd backend && npm start`
2. Start frontend app: `cd frontend && npm start`
3. Navigate to login page
4. Click "Sign in with Google"
5. Complete Google authentication
6. You should be redirected to dashboard

## Apple OAuth Setup

### 1. Create Apple Sign In Service

1. Go to [Apple Developer Account](https://developer.apple.com/account/)
2. Go to **Certificates, Identifiers & Profiles**
3. Create an **App ID**:
   - Description: Twitter Clone
   - Bundle ID: `com.yourcompany.twitterclone`
   - Enable **Sign In with Apple** capability
4. Create a **Services ID**:
   - Description: Twitter Clone Web
   - Identifier: `com.yourcompany.twitterclone.web`
   - Enable **Sign In with Apple**
   - Configure Sign In with Apple:
     - Primary App ID: Select your App ID from step 3
     - Website URLs:
       - Domain: `localhost` (dev) or `yourdomain.com` (prod)
       - Return URL: `http://localhost:5000/api/auth/apple/callback`
5. Create a **Key** for Sign In with Apple:
   - Key Name: Twitter Clone Apple Sign In Key
   - Enable **Sign In with Apple**
   - Select your Primary App ID
   - Download the `.p8` key file (save securely, cannot re-download)
   - Note the **Key ID** shown after creation

### 2. Configure Backend Environment Variables

Add to `backend/.env`:

```env
APPLE_CLIENT_ID=com.yourcompany.twitterclone.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY_PATH=./config/AuthKey_XXXXXXXXXX.p8
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback
FRONTEND_URL=http://localhost:3000
```

**Note:** Place your `.p8` key file in `backend/config/` directory

### 3. Find Your Team ID

1. Go to [Apple Developer Account](https://developer.apple.com/account/)
2. Click on your account name in the top right
3. Your **Team ID** is displayed on the membership page

### 4. Test Apple OAuth

1. Start backend server: `cd backend && npm start`
2. Start frontend app: `cd frontend && npm start`
3. Navigate to login page
4. Click "Sign in with Apple"
5. Complete Apple authentication
6. You should be redirected to dashboard

## Database Setup

### Using Docker Compose (Recommended):

The OAuth migration is automatically applied when starting with docker-compose:

```bash
docker-compose up -d
```

### Manual Database Setup:

Run the OAuth migration script:

```bash
mysql -u twitter_user -p twitter_clone < database/add_oauth_support.sql
```

This adds the following columns to the `users` table:
- `google_id` - Unique identifier for Google users
- `apple_id` - Unique identifier for Apple users
- `oauth_provider` - Tracks which OAuth provider was used
- `profile_picture` - Stores profile picture URL from OAuth providers

## OAuth Flow

### User Authentication Flow:

1. **User clicks OAuth button** (Google or Apple)
2. **Frontend redirects** to backend OAuth endpoint:
   - Google: `http://localhost:5000/api/auth/google`
   - Apple: `http://localhost:5000/api/auth/apple`
3. **Backend redirects** to OAuth provider for authentication
4. **User authenticates** with provider
5. **Provider redirects back** to backend callback URL with auth code
6. **Backend Passport strategy** exchanges code for user profile
7. **Backend finds or creates user** in database:
   - Checks if OAuth ID exists
   - If not, checks if email exists (links account)
   - If not, creates new user with unique username
8. **Backend generates JWT token** for user
9. **Backend redirects** to frontend callback page with token:
   - `http://localhost:3000/oauth/callback?token=JWT_TOKEN`
10. **Frontend extracts token** from URL
11. **Frontend stores token** in localStorage
12. **Frontend verifies token** and gets user data
13. **User is authenticated** and redirected to dashboard

## Security Considerations

### Production Deployment:

1. **Use HTTPS** for all OAuth callbacks
2. **Secure JWT secret** - Use strong, random string
3. **Validate redirect URIs** - Only allow trusted domains
4. **Store .p8 key securely** - Never commit to version control
5. **Use environment variables** - Never hardcode credentials
6. **Implement rate limiting** - Prevent OAuth abuse
7. **Add CORS configuration** - Restrict to your frontend domain

### Environment Variables Security:

```bash
# Never commit these files:
backend/.env
backend/config/*.p8

# Add to .gitignore:
.env
.env.local
*.p8
```

## Troubleshooting

### Google OAuth Issues:

- **"redirect_uri_mismatch"** - Check callback URL matches in Google Console
- **"unauthorized_client"** - Verify Google+ API is enabled
- **"access_denied"** - User cancelled login or app not approved

### Apple OAuth Issues:

- **"invalid_client"** - Check Client ID and Team ID are correct
- **"invalid_grant"** - Verify .p8 key and Key ID match
- **"invalid_redirect_uri"** - Check Services ID configuration

### General Issues:

- **Token not received** - Check FRONTEND_URL in backend .env
- **User not created** - Check database connection and migration
- **CORS errors** - Configure CORS in backend server.js

## Testing OAuth Locally

For local development, OAuth providers require valid redirect URIs. You can use:

1. **localhost** - Most providers support `http://localhost` for development
2. **ngrok** - Create temporary public URL:
   ```bash
   ngrok http 5000
   # Use ngrok URL in OAuth provider settings
   ```

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
