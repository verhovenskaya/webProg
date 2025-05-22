import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const BlacklistedToken = sequelize.sequelize.define(
  'BlacklistedToken',
  {
    token: {
      type: DataTypes.STRING(512),
      primaryKey: true,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'blacklisted_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

export default BlacklistedToken;