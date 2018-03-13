const { Recipe, Ingredient } = require('../models/')

function index(req,res) {
  Ingredient.findAll({
    include: [{
      model: Recipe,
      as: 'recipes',
      attributes: ['title', 'description', 'instructions'],
      through: {
        attributes: ['meassurementAmount', 'meassurementType']
      }
    }]
  })
  .then((ingredient) => {
    return res.status(200).json(ingredient)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Ingredient.create({
    name: req.body.name
  })
  .then((ingredient) => {
    return res.status(200).json(ingredient)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Ingredient.findById(req.params.id, {
    include: [{
      model: Recipe,
      as: 'recipes',
      attributes: ['title', 'description', 'instructions'],
      through: {
        attributes: ['meassurementAmount', 'meassurementType']
      }
    }]
  })
    .then((ingredient) => {
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient Not Found' });
      }

      return res.status(200).json(ingredient);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Ingredient.findById(req.params.id)
    .then((ingredient) => {
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient Not Found' });
      }

      ingredient.update({
        ...ingredient, //spread out existing ingredient
        ...req.body //spread out body - the differences in the body will over ride the ingredient returned from DB.
      })
      .then((updatedIngredient) => {
        return res.status(200).json(updatedIngredient)
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function destroy(req,res) {
  Ingredient.findById(req.params.id)
    .then((ingredient) => {
      if (!ingredient) {
        return res.status(400).json({ message: 'Ingredient Not Found' });
      }

      ingredient.destroy()
      .then((ingredient) => {
        return res.status(200).json(ingredient)
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

module.exports = { index, create, show, update, destroy }
