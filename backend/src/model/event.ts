import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize';
import dbConfig from '../config/db';
import User from './user';

// Получаем экземпляр sequelize из dbConfig
const sequelize = dbConfig.sequelize;

interface EventAttributes {
  id?: number;
  title: string;
  description: string | null;
  date: Date;
  location: string;
  createdby: number;
}

class Event extends Model<EventAttributes> implements EventAttributes {
  public id?: number;
  public title!: string;
  public description!: string | null;
  public date!: Date;
  public location!: string;
  public createdby!: number;
}

Event.init(
  {
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
    location: {
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
  },
  {
    sequelize, // Теперь это допустимо, так как мы используем класс Model
    modelName: 'Event',
    tableName: 'events',
    timestamps: false,
  },
);

Event.belongsTo(User, { foreignKey: 'createdby', as: 'creator' });

export default Event;
