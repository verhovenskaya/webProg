const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const User = require('./user');

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

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date: { 
        type: DataTypes.DATE, 
        allowNull: false,
    },
    location: { // Новое поле
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdby: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize, 
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
});

Event.belongsTo(User, { foreignKey: 'createdby', as: 'creator' });

module.exports = Event;