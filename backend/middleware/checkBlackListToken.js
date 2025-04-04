const BlacklistedToken = require('../model/blackListToken');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return next();
  
  const blacklisted = await BlacklistedToken.findOne({ where: { token } });
  if (blacklisted) {
    return res.status(401).json({ message: 'Токен более недействителен' });
  }
  
  next();
};