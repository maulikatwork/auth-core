// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type User = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TokenPayload = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SerializedUser = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OAuthProfile = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CookieOptions = Record<string, any>;

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn?: string;
    cookie?: {
      enabled: boolean;
      options?: CookieOptions;
    };
    generateTokenPayload: (user: User) => TokenPayload;
  };

  serializeUser: (user: User) => SerializedUser;

  findUser: (
    identifier: string,
    context?: {
      strategy: 'emailPassword' | 'phoneOtp' | 'oauth' | string;
    }
  ) => Promise<User | null>;

  onOtpRequest?: (phone: string, otp: string) => Promise<void>;

  verifyOtp?: (phone: string, otp: string) => Promise<boolean>;

  verifyPassword?: (email: string, password: string) => Promise<boolean>;

  oauthCallbackHandler?: (profile: OAuthProfile, provider: string) => Promise<User | null>;
}
