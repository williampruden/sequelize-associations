var express = require('express');
var router = express.Router();

const ingredientController = require('../controllers/ingredient-controller')

// http://localhost:3000/ingredients
router.get('/', ingredientController.index);
router.post('/', ingredientController.create);
router.get('/:id', ingredientController.show);
router.put('/:id', ingredientController.update);
router.delete('/:id', ingredientController.destroy);

module.exports = router;
