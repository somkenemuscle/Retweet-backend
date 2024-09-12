import jwt from 'jsonwebtoken'
import { secretKey } from './config.js';

export default function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  };

  const options = {
    expiresIn: '24h', 
  };

  return jwt.sign(payload, secretKey, options);
}

