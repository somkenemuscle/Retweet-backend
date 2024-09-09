import mongoose from 'mongoose';
const { Schema } = mongoose;


// User Schema
const tweetSchema = new Schema({
    text: {
        type: String,
        default: null,
        required: function () {
            return !this.image;
        },
    },
    image: {
        type: String,
        default: null,
        required: function () {
            return !this.text;
        },
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
