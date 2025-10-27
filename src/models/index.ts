import { Sequelize } from 'sequelize';
import { initUserModel } from './user-model.js';
import { initCategoryModel } from './category-model.js';

export const registerModels = (sequelize: Sequelize) => {
  const models = {
    User: initUserModel(sequelize),
    Category: initCategoryModel(sequelize),
    // Add other models here
  };
  return models;
};