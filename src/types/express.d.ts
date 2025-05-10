import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: string | null;
      org?: any;
    }
  }
}

export {};
