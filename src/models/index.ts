import { Sequelize } from 'sequelize';
import { initUserModel } from './user-model.js';

export const registerModels = (sequelize: Sequelize) => {
  const models = {
    User: initUserModel(sequelize),
    // Add other models here
  };
  return models;
};