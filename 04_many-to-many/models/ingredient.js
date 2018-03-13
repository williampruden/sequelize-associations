'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Ingredient.associate = (models) => {
    Ingredient.belongsToMany(models.Recipe, {
      through: "RecipeIngredient",
      foreignKey: 'ingredientId',
      as: 'recipes'
    });
  };

  return Ingredient;
};
