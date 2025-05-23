export { initializeAuth } from './config/config';
export { sendOtp, verifyOtp } from './strategies/phoneOtp';
export { authMiddleware } from './middlewares';
export { generateOtp, issueToken } from './utils';
