const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const Event = require('./event');

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
    createdat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize, 
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
});


module.exports = User;