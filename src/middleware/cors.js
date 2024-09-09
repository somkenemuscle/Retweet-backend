import cors from 'cors';

// Create and export the CORS middleware configuration
const corsMiddleware = cors({
  origin: '*',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
});

export default corsMiddleware;
