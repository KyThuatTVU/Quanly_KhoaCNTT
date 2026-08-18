/**
 * src/modules/auth/passport.config.js
 * Cấu hình Passport.js với Google OAuth 2.0 Strategy
 */
import passport            from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config              from '../../config/index.js';
import { AdminAuthService } from './services/adminAuth.service.js';

export function configurePassport() {
  // Serialize: chỉ lưu admin ID vào session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize: lấy lại admin từ DB theo ID trong session
  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await AdminAuthService.getAdminProfile(id);
      done(null, admin);
    } catch (err) {
      done(err, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID:     config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL:  config.google.callbackUrl,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const admin = await AdminAuthService.handleGoogleCallback(profile);
      return done(null, admin);
    } catch (err) {
      // Truyền lỗi để passport redirect đến failureRedirect
      return done(null, false, { message: err.message });
    }
  }));

  return passport;
}
