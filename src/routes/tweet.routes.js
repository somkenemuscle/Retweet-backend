import express from 'express';
import { getAllTweets, getTweet, createTweet, getUserTweets, deleteComment, deleteTweet, createComment, getAllComments } from '../controllers/tweet.controller.js';
import isLoggedin from '../utils/isLoggedin.js';
import handleAsyncErr from '../utils/catchAsync.js';
const router = express.Router();


// GET all tweets
router.get("/", getAllTweets);

// GET all comments for a specific tweets
router.get("/:tweetId/comments", getAllComments);

// // Route to get all tweets for a specific user
router.get('/user/:username/', handleAsyncErr(getUserTweets));

// GET a specific tweet by ID
router.get("/:tweetId", handleAsyncErr(getTweet));

// POST a new tweet
router.post("/", isLoggedin, handleAsyncErr(createTweet));

//Create a comment
router.post("/:tweetId/comments", isLoggedin, handleAsyncErr(createComment));

// Delete a specific tweet by ID
router.delete("/:tweetId", isLoggedin, handleAsyncErr(deleteTweet));

// Delete a specific comment by ID in campground and comment model
router.delete("/:tweetId/comments/:commentId", isLoggedin, handleAsyncErr(deleteComment));


// Error handling middleware
router.use((err, req, res, next) => {
    // Extract status and message from the error object, defaulting to 500 and a generic message
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    // Log the error details to the console for debugging
    console.error(err);

    // Send the error response to the client
    res.status(status).json({ message });
});



export default router;
