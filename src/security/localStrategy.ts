import { Strategy } from 'passport-local';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export default new Strategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async (email, password, done) => {
        const user = await User.findOne({
            where: {
                email
            },
        });

        if(!user) {
            return done(null, false);
        }

        if(!await bcrypt.compare(password, user.password)) {
            return done(null, false);
        }

        done(null, user);
    }
)