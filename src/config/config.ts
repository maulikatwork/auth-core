import { AuthConfig } from '../types/auth-config';

let authConfig: AuthConfig;

export const initializeAuth = (config: AuthConfig) => {
  authConfig = config;
};

export const getAuthConfig = (): AuthConfig => {
  if (!authConfig) {
    throw new Error('Auth not initialized. Call initializeAuth(config) first.');
  }
  return authConfig;
};
