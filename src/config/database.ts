import dotenv from 'dotenv';
import { logger } from './logging.js';
import { Sequelize } from 'sequelize';
import { registerModels } from '../models/index.js';

dotenv.config();

const database = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        logging: false,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT as any,
    }
);

export const models = registerModels(database);

export const initializeDatabase = async (): Promise<void> => {
  try {
    await database.authenticate();
    logger.info('Database connection has been established successfully.');

    // Sync models with database
    // Note: In production, consider using migrations instead
    await database.sync({alter: true});
    logger.info('Models synchronized successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default database;