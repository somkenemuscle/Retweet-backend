import dotenv from 'dotenv';
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import passport from 'passport';
import userRoutes from './routes/user.routes.js';
import tweetRoutes from './routes/tweet.routes.js';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';
import throttle from './middleware/throttle.js';

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Initialize Express application
const app = express();


// Use the CORS middleware
app.use(corsMiddleware);

// Apply general rate limiter before any API processing
app.use(throttle);

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body
app.use(express.json());

// Use cookieParser middleware
app.use(cookieParser());

// Initialize Passport for authentication
app.use(passport.initialize());

// Apply specific rate limiter to API routes
app.use('/api/', apiLimiter);

// routing logic
app.use('/api/auth', userRoutes);
app.use('/api/tweets', tweetRoutes);


export default app;
