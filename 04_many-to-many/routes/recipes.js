var express = require('express');
var router = express.Router();

const recipeController = require('../controllers/recipe-controller')

// http://localhost:3000/recipes
router.get('/', recipeController.index);
router.post('/', recipeController.create);
router.get('/:id', recipeController.show);
router.put('/:id', recipeController.update);
router.delete('/:id', recipeController.destroy);
router.post('/:recipeId/ingredients/:ingredientId', recipeController.addIngredientToRecipe);

module.exports = router;
