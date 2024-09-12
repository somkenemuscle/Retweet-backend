import cors from 'cors';

// Create and export the CORS middleware configuration
const corsMiddleware = cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
});

export default corsMiddleware;
