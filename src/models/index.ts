import { Sequelize } from 'sequelize';
import { initUserModel } from './user-model.js';
import { initProductModel } from './product-model.js';
import { initCategoryModel } from './category-model.js';

export const registerModels = (sequelize: Sequelize) => {
  const models = {
    User: initUserModel(sequelize),
    Category: initCategoryModel(sequelize),
    Product: initProductModel(sequelize),
    // Add other models here
  };

  models.Category.hasMany(models.Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });

  models.Product.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  return models;
};