import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();
import { signInUser, signUpUser, logOutUser, refreshToken } from '../controllers/user.controller.js';


// /Signup post route
router.post("/signup", handleAsyncErr(signUpUser));

// POST /login route
router.post("/signin", handleAsyncErr(signInUser));

// POST /logout route
router.post("/logout", handleAsyncErr(logOutUser));

//Refresh Token
router.post("/token", refreshToken);


export default router;