import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
  createdat?: Date;
}

interface UserCreationAttributes {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare middleName?: string;
  declare email: string;
  declare password: string;
  declare gender?: 'male' | 'female' | 'other';
  declare birthDate?: Date;
  declare createdat: Date;

  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    middleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [0, 50],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString(),
      },
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export default User;