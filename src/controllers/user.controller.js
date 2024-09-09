import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';
import generateToken from '../auth/auth.js'


//Sign Up Controller Function
export const signUpUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
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
        res.status(201).json({ message: 'User registered successfully', token, newUser });

    } catch (error) {
        console.error('Error during SignUp:', error);
        res.status(500).json({ message: 'Error Occured While Signing Up' });
    }
}


//Sign In Controller Function
export const signInUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists by their email/username
        const user = await User.findOne({ username });

        if (!user) {
            // User not found
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match, generate JWT token
            const token = generateToken(user);
            return res.status(200).json({ message: 'Sign In successful', token });
        } else {
            // Passwords don't match
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error Occured during Login:', error);
        res.status(500).json({ message: 'Error Occured While Signing In' });
    }
}