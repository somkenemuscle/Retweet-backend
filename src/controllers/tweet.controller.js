import { Comment } from '../models/comment.model.js';
import { Tweet } from '../models/tweet.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// GET all tweets
export const getAllTweets = async (req, res) => {
    // Fetch tweets and sort by createdAt field in descending order (newest first)
    const tweets = await Tweet.find().sort({ createdAt: -1 }).populate('author').populate('comments').populate('likes');
    res.json(tweets);
}

// GET all tweets for a specific user
export const getUserTweets = async (req, res) => {
    const username = req.params.username;
    // Check if the user exists by their username
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: 'Sorry, this user does not exist' });
    }
    // Find all tweets by a particular user by their username
    const tweets = await Tweet.find({ author: user._id }).sort({ createdAt: -1 }).populate('author').populate('comments');
    res.json(tweets);
}



// SAVE tweet for user function
export const getSavedTweets = async (req, res) => {
    const { username } = req.params;
    // Find the user by username
    const user = await User.findOne({ username }).populate({
        path: 'saves', // Populate the 'saves' array
        model: 'Tweet', // Populate with the 'Tweet' model
        populate: { path: 'author', select: 'username' } // Also populate the author field in the tweets
    });

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'Sorry, this user does not exist' });
    }

    // Return the populated saves array
    res.status(200).json({ savedTweets: user.saves });
}




// SAVE tweet for user function
export const saveTweet = async (req, res) => {
    const { tweetId } = req.params;

    // Validate the tweetId format using isValidObjectId
    if (!mongoose.isValidObjectId(tweetId)) {
        return res.status(400).json({ message: "Sorry, this post doesn't exist." });
    }

    const user = await User.findById(req.user._id); // Use findById to get the user

    if (!user) {
        return res.status(404).json({ message: 'Sorry, this user does not exist' });
    }

    // Ensure the 'saves' array exists
    if (!user.saves) {
        user.saves = []; // Initialize if undefined
    }

    // Convert tweetId to ObjectId (no need to use 'new')
    const tweetObjectId = mongoose.Types.ObjectId.createFromHexString(tweetId);

    // Check if tweetId is already in user's saves
    const isAlreadySaved = user.saves.some((savedTweetId) => savedTweetId.equals(tweetObjectId));

    if (isAlreadySaved) {
        // Unsave the tweet (remove it from the saves array)
        user.saves = user.saves.filter((savedTweetId) => !savedTweetId.equals(tweetObjectId));
        await user.save(); // Save changes to the database

        return res.status(200).json({ message: "Tweet removed from saves", user });
    } else {
        // Save the tweet (add to the saves array)
        user.saves.push(tweetObjectId);
        await user.save(); // Save changes to the database

        return res.status(200).json({ message: "Tweet added to saves", user });
    }
};


//like tweet
export const likeTweet = async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id; // userId from token (ObjectId)

    // Validate tweetId and userId format using isValidObjectId
    if (!mongoose.isValidObjectId(tweetId) || !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid tweet or user ID." });
    }


    const tweet = await Tweet.findById(tweetId); // Find the tweet by ID

    if (!tweet) {
        return res.status(404).json({ message: 'Post not found' }); // Return if tweet doesn't exist
    }

    // Check if userId exists in tweet.likes (array of ObjectIds)
    const hasLiked = tweet.likes.some((like) => like.equals(userId));

    if (hasLiked) {
        // Unlike the post
        tweet.likes = tweet.likes.filter((like) => !like.equals(userId));
        await tweet.save();
        return res.status(200).json({ likes: tweet.likes.length });
    } else {
        // Like the post
        tweet.likes.push(userId);
        await tweet.save();
        return res.status(200).json({ likes: tweet.likes.length });
    }
};


// GET a specific tweet by ID
export const getTweet = async (req, res) => {
    const id = req.params.tweetId;

    // Validate the tweetId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Sorry, this post doesn't exist." });
    }

    const foundTweet = await Tweet.findById(id).populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } }, // Sort comments by createdAt in descending order
        populate: {
            path: 'author'
        }
    })
        .populate('author');
    // If tweet is not found, return 404 status with an error message
    if (!foundTweet) {
        return res.status(404).json({ message: "Sorry, this post doesn't exist." });
    }
    res.json({ foundTweet });
}





//Get all comments for a specific tweet
export const getAllComments = async (req, res) => {
    const foundTweet = await Tweet.findById(req.params.tweetId)
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }, // Sort comments by createdAt in descending order
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.json(foundTweet.comments); // Return only the comments array from the found tweet
};



// POST a new tweet
export const createTweet = async (req, res) => {
    const { text, image } = req.body;
    const newTweet = await Tweet.create({
        text,
        image,
        author: req.user._id,
    });
    await newTweet.save(); // Save the changes to the database

    res.status(200).json({ message: "Tweet made", newTweet });
}

//POST a comment
export const createComment = async (req, res) => {
    const foundTweet = await Tweet.findById(req.params.tweetId).populate('comments').populate('author');
    if (!foundTweet) {
        return res.status(404).json({ message: "Tweet not found" });
    }
    const newComment = await Comment.create({
        ...req.body,
        author: req.user._id,
    });
    foundTweet.comments.push(newComment)
    await newComment.save(); // Save the changes to the database
    await foundTweet.save();
    res.status(200).json({ message: "Comment Made", newComment });
};

// Delete a specific tweet by ID
export const deleteTweet = async (req, res) => {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" });
    }
    // Check if the authenticated user's ID matches the tweetauthorid of the tweet
    if (!req.user._id.equals(tweet.author._id)) {
        return res.status(403).json({ message: "Unauthorized: You don't have permission to delete this tweet" });
    }
    await Tweet.findByIdAndDelete(req.params.tweetId);
    return res.status(200).json({ message: "Tweet Deleted " });
}

// Delete a specific comment by ID in campground and comment model
export const deleteComment = async (req, res) => {
    const { tweetId, commentId } = req.params;
    //Find the comment by its id
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    // Check if the authenticated user's ID matches the comment author id of the tweet
    if (!req.user._id.equals(foundComment.author._id)) {
        return res.status(403).json({ message: "Unauthorized: You don't have permission to delete this comment" });
    }
    await Tweet.findByIdAndUpdate(tweetId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Comment deleted" });
}