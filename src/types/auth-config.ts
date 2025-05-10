export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn?: string;
    cookie?: {
      enabled: boolean;
      options?: Record<string, any>;
    };
    generateTokenPayload: (user: any) => Record<string, any>;
  };

  serializeUser: (user: any) => Record<string, any>;

  findUser: (
    identifier: string,
    context?: {
      strategy: 'emailPassword' | 'phoneOtp' | 'oauth' | string;
    }
  ) => Promise<any>;

  onOtpRequest?: (phone: string, otp: string) => Promise<void>;

  verifyOtp?: (phone: string, otp: string) => Promise<boolean>;

  oauthCallbackHandler?: (
    profile: any,
    provider: string
  ) => Promise<any>;
}
