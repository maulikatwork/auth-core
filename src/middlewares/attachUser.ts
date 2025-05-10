import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getAuthConfig } from '../config/config';

export const attachUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = getAuthConfig();

    // Extract token
    let token: string | undefined;
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      token = bearer.split(' ')[1];
    } else if (config.jwt.cookie?.enabled) {
      token = req.cookies?.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Decode token
    const decoded = jwt.verify(token, config.jwt.secret as string) as any;

    // Fetch full user (optional)
    if (config.findUser) {
      const user = await config.findUser(decoded.id || decoded.uid, { strategy: 'token' });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid user' });
      }
      req.user = config.serializeUser(user);
    } else {
      req.user = decoded; // fallback to token payload
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
