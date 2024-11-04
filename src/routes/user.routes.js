import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();
import { signInUser, signUpUser, logOutUser, findUser, refreshToken } from '../controllers/user.controller.js';
import { signInLimiter, signUpLimiter } from '../middleware/rateLimiter.js';

// /Signup post route
router.post("/signup", signUpLimiter, handleAsyncErr(signUpUser));

// POST /login route
router.post("/signin", signInLimiter, handleAsyncErr(signInUser));

// Find User by username route
router.get("/search/:username", handleAsyncErr(findUser));

// POST /logout route
router.post("/logout", handleAsyncErr(logOutUser));

//Refresh Token
router.post("/token", handleAsyncErr(refreshToken));


export default router;