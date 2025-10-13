// Passport configuration for OAuth authentication
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');

// Initialize passport strategies
const initializePassport = () => {
  // Google OAuth Strategy (only if credentials are configured)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
      process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
    
    const googleStrategy = new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Profile data from Google
          const googleProfile = {
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            picture: profile.photos[0]?.value
          };

          return done(null, googleProfile);
        } catch (error) {
          return done(error, null);
        }
      }
    );

    passport.use('google', googleStrategy);
    console.log('✅ Google OAuth strategy enabled');
  } else {
    console.log('⚠️  Google OAuth not configured (set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env)');
  }

  // Apple OAuth Strategy (only if credentials are configured)
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && 
      process.env.APPLE_CLIENT_ID !== 'your_apple_client_id_here') {
    
    const appleStrategy = new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/apple/callback',
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
        scope: ['name', 'email']
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Profile data from Apple
          const appleProfile = {
            provider: 'apple',
            providerId: profile.id,
            email: profile.email,
            fullName: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : profile.email.split('@')[0],
            firstName: profile.name?.firstName,
            lastName: profile.name?.lastName
          };

          return done(null, appleProfile);
        } catch (error) {
          return done(error, null);
        }
      }
    );

    passport.use('apple', appleStrategy);
    console.log('✅ Apple OAuth strategy enabled');
  } else {
    console.log('⚠️  Apple OAuth not configured (set APPLE_CLIENT_ID and APPLE_TEAM_ID in .env)');
  }

  // Serialize user for session (not used in JWT-based auth, but required by passport)
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = {
  initializePassport,
  passport
};
