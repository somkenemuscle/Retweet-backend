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
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

//delete all tweet and comments
tweetSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        });
    }
});


export const Tweet = mongoose.model('Tweet', tweetSchema);
