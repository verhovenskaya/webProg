/*реализована JWT-аутентификация с помощью Passport.js    */                                                                                           /* eslint-disable */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '@models/user';
import BlacklistedToken from '@models/blackListToken';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

// Объявляем расширение для Express User
declare global {
  namespace Express {
    interface User extends InstanceType<typeof User> {}
  }
}

interface JwtPayload {
  id: number;
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
  passReqToCallback: true as const,
};

passport.use(
  new JwtStrategy(options, async (req: Request, payload: JwtPayload, done) => {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        return done(null, false, { message: 'Токен отсутствует' });
      }

      const isBlacklisted = await BlacklistedToken.findOne({
        where: { token },
      });
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
  })
);

// Типизация для serializeUser 
passport.serializeUser((user: Express.User, done: (err: Error | null, id?: number) => void) => {
  done(null, user.id);
});

// Типизация для deserializeUser 
passport.deserializeUser(async (id: number, done: (err: Error | null, user?: Express.User | null) => void) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    if (err instanceof Error) {
      done(err);
    } else {
      done(new Error('Unknown error during deserialization'));
    }
  }
});

export default passport;