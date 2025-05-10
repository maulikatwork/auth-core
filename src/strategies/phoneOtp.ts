import { Request, Response } from 'express';
import { getAuthConfig } from '../config/config';
import { generateOtp } from '../utils/otp';
import { issueToken } from '../utils/token';

export const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });

  const config = getAuthConfig();
  if (!config.onOtpRequest) {
    return res.status(500).json({ success: false, message: 'OTP logic not implemented' });
  }

  const otp = generateOtp();
  await config.onOtpRequest(phone, otp);

  return res.status(200).json({ success: true, message: 'OTP sent' ,...(process.env.NODE_ENV !== 'production' && { debugOtp: otp } )  });
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
  
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }
  
    const config = getAuthConfig();
  
    if (!config.verifyOtp || !config.findUser) {
      return res.status(500).json({ success: false, message: 'OTP verification not configured' });
    }
  
    const isValid = await config.verifyOtp(phone, otp);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid OTP' });
  
    const user = await config.findUser(phone, { strategy: 'phoneOtp' });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
    const token = issueToken(user, res);
  
    const serialized = config.serializeUser(user);
  
    return res.status(200).json({
      success: true,
      token,
      user: serialized
    });
  };
  