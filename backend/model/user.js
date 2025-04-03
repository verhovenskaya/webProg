const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize(
    dbConfig.sequelize.config.database,
    dbConfig.sequelize.config.username,
    dbConfig.sequelize.config.password,
    {
        host: dbConfig.sequelize.config.host,
        dialect: 'postgres',
        logging: false,
    }
);

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        set(value) {
            this.setDataValue('password', value);
        }
    },
    createdat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                console.log('Hashed password:', user.password);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Метод для проверки пароля
User.prototype.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;