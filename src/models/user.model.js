import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'User already exists'],
        minlength: [4, 'Username must be at least 4 characters long'],
        maxlength: [20, 'Username must be no more than 20 characters long'],
        match: [/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, or dashes - schema']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User already exists'],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Must be a valid email address with format "name@gmail.com - schema"']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    saves: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    }]
});

export const User = mongoose.model('User', userSchema);

