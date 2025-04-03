const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User = require('../model/user');
const BlacklistedToken = require('../model/blackListToken');
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true // Добавляем возможность использовать req в колбэке
};

// Регистрируем стратегию правильно
const strategy = new JwtStrategy(options, async (req, payload, done) => {
  try {
    // 1. Проверяем черный список токенов
    const token = options.jwtFromRequest(req);
    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
    
    if (isBlacklisted) {
      return done(null, false, { message: 'Токен недействителен' });
    }

    // 2. Ищем пользователя
    const user = await User.findByPk(payload.id);
    
    if (!user) {
      return done(null, false, { message: 'Пользователь не найден' });
    }

    // 3. Возвращаем пользователя
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(strategy);

// Сериализация/десериализация пользователя (обязательно!)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;