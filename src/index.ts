export { initializeAuth } from './config/config';
export { sendOtp, verifyOtp } from './strategies/phoneOtp';
export { loginWithEmailPassword } from './strategies/emailPassword';
export { authMiddleware } from './middlewares';
export { generateOtp, issueToken } from './utils';

// Export types
export type {
  AuthConfig,
  User,
  TokenPayload,
  SerializedUser,
  OAuthProfile,
  CookieOptions,
} from './types/auth-config';
