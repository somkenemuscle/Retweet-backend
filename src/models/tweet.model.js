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
        // Check if there are comments to delete
        if (doc.comments && doc.comments.length > 0) {
            try {
                // Proceed to delete the comments
                await Comment.deleteMany({
                    _id: {
                        $in: doc.comments
                    }
                });
                console.log(`Deleted ${doc.comments.length} comments associated with the tweet.`);
            } catch (error) {
                console.error('Error deleting comments:', error);
                // Handle the error gracefully, e.g., log it or notify someone
            }
        } else {
            console.log('No comments found for this tweet. Proceeding to delete the tweet.');
        }
    }
});


export const Tweet = mongoose.model('Tweet', tweetSchema);
