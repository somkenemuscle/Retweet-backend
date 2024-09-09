import express from 'express';
import { Tweet } from '../models/tweet.model';
import handleAsyncErr from '../utils/catchAsync';
import isLoggedin from '../utils/isLoggedin';
import { Comment } from '../models/comment.model';
const router = express.Router();
