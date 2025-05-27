import { Request, Response } from 'express';
import { getAuthConfig } from '../config/config';
import { issueToken } from '../utils/token';

export const loginWithEmailPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const config = getAuthConfig();

  if (!config.verifyPassword || !config.findUser) {
    return res.status(500).json({
      success: false,
      message: 'Password verification not configured',
    });
  }

  try {
    // First verify the password
    const isValid = await config.verifyPassword(email, password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Then find the user
    const user = await config.findUser(email, { strategy: 'emailPassword' });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Issue token
    const token = issueToken(user, res);

    // Serialize user data
    const serialized = config.serializeUser(user);

    return res.status(200).json({
      success: true,
      token,
      user: serialized,
    });
  } catch (error) {
    console.error('Email/password login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
