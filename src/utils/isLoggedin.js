import jwt from 'jsonwebtoken';
import { secretKey } from '../auth/config.js';

export default function isLoggedIn(req, res, next) {
    // Extract token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach decoded user information to request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
}
