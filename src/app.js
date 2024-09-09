import dotenv from 'dotenv';
import express from 'express';
import corsMiddleware from './middleware/cors.js'; // Ensure correct file extension
import passport from 'passport';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing/uploadthing.js';
import userRoutes from './routes/user.routes.js'
import tweetRoutes from './routes/tweet.routes.js'



// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Initialize Express application
const app = express();

// Use the CORS middleware
app.use(corsMiddleware);

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body
app.use(express.json());

// Initialize Passport for authentication
app.use(passport.initialize());

// Set up UploadThing route
app.use('/api/uploadthing', createRouteHandler({
    router: uploadRouter,
    config: { /* your config here */ },
}),
);

// routing logic
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes)



export default app;
