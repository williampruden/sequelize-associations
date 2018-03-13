'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecipeIngredient = sequelize.define('RecipeIngredient', {
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    meassurementAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    meassurementType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  return RecipeIngredient;
};
