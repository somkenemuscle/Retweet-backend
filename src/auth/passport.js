import { User } from '../models/user.model.js';
import { secretKey } from './config.js';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};

export default passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

