import { SerializedUser } from './auth-config';

declare global {
  namespace Express {
    interface Request {
      user?: SerializedUser;
      role?: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      org?: any;
    }
  }
}

export {};
