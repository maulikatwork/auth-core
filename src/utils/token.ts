import { Response } from 'express';
import { getAuthConfig } from '../config/config';

export const issueToken = (user: any, res: Response): string => {
  const config = getAuthConfig();

  const payload = config.jwt.generateTokenPayload(user);
  const token = require('jsonwebtoken').sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expiresIn || '1d',
  });

  if (config.jwt.cookie?.enabled && config.jwt.cookie.options) {
    res.cookie('token', token, config.jwt.cookie.options);
  }

  return token;
};
