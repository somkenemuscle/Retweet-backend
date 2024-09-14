import cors from 'cors';

// Create and export the CORS middleware configuration
const corsMiddleware = cors({
  origin: `${process.env.VERCEL_FRONTEND_URL}`, // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
});

export default corsMiddleware;
