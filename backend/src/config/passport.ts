import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../model/user';
import BlacklistedToken from '../model/blackListToken';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

declare global {
  namespace Express {
    interface User extends InstanceType<typeof User> {}
  }
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}



const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
  passReqToCallback: true as const,
};

passport.use(new JwtStrategy(options, async (req: Request, payload: JwtPayload, done) => {
  try {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      return done(null, false, { message: 'Токен отсутствует' });
    }

    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (isBlacklisted) {
      return done(null, false, { message: 'Токен недействителен' });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return done(null, false, { message: 'Пользователь не найден' });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Правильная типизация для serializeUser
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});


// Правильная типизация для deserializeUser
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
