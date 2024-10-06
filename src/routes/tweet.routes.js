import express from 'express';
import { getAllTweets, getTweet, createTweet, getUserTweets, deleteComment, deleteTweet, createComment, getAllComments, saveTweet, getSavedTweets, likeTweet } from '../controllers/tweet.controller.js';
import isLoggedin from '../utils/isLoggedin.js';
import handleAsyncErr from '../utils/catchAsync.js';
const router = express.Router();


// GET all tweets
router.get("/", handleAsyncErr(getAllTweets));

// GET all comments for a specific tweets
router.get("/:tweetId/comments", handleAsyncErr(getAllComments));

// // Route to get all tweets for a specific user
router.get('/user/:username/', handleAsyncErr(getUserTweets));

// GET a specific tweet by ID
router.get("/:tweetId", handleAsyncErr(getTweet));

// POST a new tweet
router.post("/", isLoggedin, handleAsyncErr(createTweet));

// Save a tweet for a user
router.post("/:tweetId/save", isLoggedin, handleAsyncErr(saveTweet));

//like tweet route
router.post("/:tweetId/like", isLoggedin, handleAsyncErr(likeTweet));

// // Get saves for user
router.get('/:username/saves', handleAsyncErr(getSavedTweets));

//Create a comment
router.post("/:tweetId/comments", isLoggedin, handleAsyncErr(createComment));

// Delete a specific tweet by ID
router.delete("/:tweetId", isLoggedin, handleAsyncErr(deleteTweet));

// Delete a specific comment by ID in campground and comment model
router.delete("/:tweetId/comments/:commentId", isLoggedin, handleAsyncErr(deleteComment));





export default router;
