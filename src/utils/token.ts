import { Response } from 'express';
import { getAuthConfig } from '../config/config';
import { User } from '../types/auth-config';

export const issueToken = (user: User, res: Response): string => {
  const config = getAuthConfig();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jwt = require('jsonwebtoken');

  const payload = config.jwt.generateTokenPayload(user);
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || '1d',
  });

  if (config.jwt.cookie?.enabled && config.jwt.cookie.options) {
    res.cookie('token', token, config.jwt.cookie.options);
  }

  return token;
};
