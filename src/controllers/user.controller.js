import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';
import generateToken from '../auth/auth.js'

//Sign Up Controller Function
export const signUpUser = async (req, res, next) => {
    try {
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
        const token = generateToken(newUser); // Assuming newUser is your registered user object
        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict', // CSRF protection
            maxAge: 24 * 60 * 60 * 1000
        }); // 24 hours
        res.status(201).json({ message: 'User registered successfully', username });

    } catch (error) {
        console.error('Error during SignUp:', error);
        res.status(500).json({ message: 'Error Occured While Signing Up' });
    }
}


//Sign In Controller Function
export const signInUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // Check if the user exists by their email/username
        const user = await User.findOne({ username });

        if (!user) {
            // User not found
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match, generate JWT token
            const token = generateToken(user);
            // Set the token as an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,  // Prevents JavaScript access
                secure: false, // Set to true if using HTTPS
                sameSite: 'Strict', // CSRF protection
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            return res.status(200).json({ message: 'Sign In successful', username });
        } else {
            // Passwords don't match
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error Occured during Login:', error);
        res.status(500).json({ message: 'Error Occured While Signing In' });
    }
}