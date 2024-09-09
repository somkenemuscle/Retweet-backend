import jwt from 'jsonwebtoken'
import { secretKey } from './config.js';

export default function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
    // Add other user information as needed
  };

  const options = {
    expiresIn: '24h', // Set token expiration time
  };

  return jwt.sign(payload, secretKey, options);
}

