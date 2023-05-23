import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateResetToken = (email) => {
    const token = jwt.sign(
      { email },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: '1h' } // token expires in 1 hour
    );
    return token;
  }