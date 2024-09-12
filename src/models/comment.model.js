import mongoose from 'mongoose';
const Schema = mongoose.Schema;


// User Schema
const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Comment = mongoose.model('Comment', commentSchema);

