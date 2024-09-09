import passport from '../auth/passport.js';

export default function isLoggedin(req, res, next) {
    passport.authenticate('jwt', { session: false })(req, res, next);
}

