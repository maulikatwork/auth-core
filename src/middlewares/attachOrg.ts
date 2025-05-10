import { Request, Response, NextFunction } from 'express';

export const attachOrg = (req: Request, res: Response, next: NextFunction) => {
  // Extract org/tenant info from user or token
  req.org = req.user?.org || null;
  next();
};