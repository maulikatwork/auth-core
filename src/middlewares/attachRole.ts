import { Request, Response, NextFunction } from 'express';

export const attachRole = (req: Request, res: Response, next: NextFunction) => {
  // Extract role from `req.user`, `req.headers`, or other context
  req.role = req.user?.role || null;
  next();
};