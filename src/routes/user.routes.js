import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();
import { signInUser, signUpUser } from '../controllers/user.controller.js';


// /Signup post route
router.post("/signup", handleAsyncErr(signUpUser));

// POST /login route
router.post("/signin", handleAsyncErr(signInUser));

export default router;