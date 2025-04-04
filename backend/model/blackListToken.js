const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const BlacklistedToken = sequelize.define('BlacklistedToken', {
  token: {
    type: DataTypes.STRING(512),
    primaryKey: true, // Используем token как первичный ключ
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Добавляем значение по умолчанию
  }
}, {
  tableName: 'blacklisted_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = BlacklistedToken;