import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../auth/auth.js'
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { refreshSecretKey } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../validators/authValidators.js';

//Sign Up Controller Function
export const signUpUser = async (req, res) => {
    // Validate the request body using Joi
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before storing in the database (hash and salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate token using the imported function
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set cookies
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(201).json({ message: 'User registered successfully', username });


}


//Sign In Controller Function
export const signInUser = async (req, res) => {

    // Validate the request body using Joi
    const { error } = signInSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { username, password } = req.body;
    // Check if the user exists by their email/username
    const user = await User.findOne({ username });

    if (!user) {
        // User not found
        return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        // Passwords match, generate JWT token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.status(200).json({ message: 'Sign In successful', username });
    } else {
        // Passwords don't match
        return res.status(401).json({ message: 'Invalid password', code: 'INVALID_PASSWORD' });
    }
}



//Log out Controller Function
export const logOutUser = async (req, res) => {

    res.cookie('refreshToken', '', { httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 0, path: '/' });
    // Clear the token cookie
    res.cookie('accessToken', '', { httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 0, path: '/' });

    res.status(200).json({ message: 'Logged out successfully' });
}


//Refresh token controller function
export const refreshToken = (req, res) => {

    const refreshToken = req.cookies?.refreshToken;

    // Check if refreshToken is present in cookies
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found, please log in again.', code: 'REFRESH_TOKEN_NOT_FOUND' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token. Please log in again.' });
        }

        // Generate a new access token
        const accessToken = generateAccessToken({ username: user.username, _id: user._id });

        // Set the new access token in an HttpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Access token refreshed successfully' });
    });
};
