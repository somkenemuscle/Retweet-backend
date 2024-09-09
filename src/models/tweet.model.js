import mongoose from 'mongoose';
const { Schema } = mongoose;


// User Schema
const tweetSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
});

export const Tweet = mongoose.model('Tweet', tweetSchema);
