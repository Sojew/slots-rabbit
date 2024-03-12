import { Sequelize, DataTypes, Model } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error('Database configuration is not set in .env file');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres'
});

interface UserAttributes {
  id?: number;
  coins: number;
  email: string;
  tgUserId: string;
  spins: number;
  losses: number;
  firstTime: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public coins!: number;
  public email!: string;
  public tgUserId!: string;
  public spins!: number;
  public losses!: number;
  public firstTime!: boolean;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tgUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  spins: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  losses: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  firstTime: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'CasinoUsers'
});

export default User;