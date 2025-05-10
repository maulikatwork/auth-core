export const generateOtp = (
    length: number = 6,
    charset: string = '0123456789'
  ): string => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += charset[Math.floor(Math.random() * charset.length)];
    }
    return otp;
  };
  