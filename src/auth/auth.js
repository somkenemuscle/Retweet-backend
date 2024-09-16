import jwt from 'jsonwebtoken'
import { secretKey, refreshSecretKey } from './config.js';

// Function to generate access token
export function generateAccessToken(user) {
  return jwt.sign({ username: user.username, _id: user._id }, secretKey, { expiresIn: '15m', });
}

// Function to generate refresh token
export function generateRefreshToken(user) {
  return jwt.sign({ username: user.username, _id: user._id }, refreshSecretKey, {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
}