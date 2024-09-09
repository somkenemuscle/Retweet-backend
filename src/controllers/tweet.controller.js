import { Comment } from '../models/comment.model.js';
import { Tweet } from '../models/tweet.model.js';



// GET all tweets
export const getAllTweets = async (req, res, next) => {
    // Fetch tweets and sort by createdAt field in descending order (newest first)
    const tweets = await Tweet.find().sort({ createdAt: -1 }).populate('author').populate('comments');
    res.json(tweets);
}

// // GET all tweets for a specific user
// export const getUserTweets = async (req, res) => {
//     const username = req.params.username;
//     // Find all tweets by a particular user by their username
//     const tweets = await Tweet.find({ username }).sort({ createdAt: -1 }).populate('author').populate('comments');
//     res.json(tweets);
// }

// GET a specific tweet by ID
export const getTweet = async (req, res, next) => {
    const foundTweet = await Tweet.findById(req.params.tweetId).populate('author').populate('comments');
    res.json({ foundTweet });
}

//Get all comments for a specific tweet
export const getAllComments = async (req, res, next) => {
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
export const createTweet = async (req, res, next) => {
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
export const createComment = async (req, res, next) => {
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
export const deleteTweet = async (req, res, next) => {
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
export const deleteComment = async (req, res, next) => {
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