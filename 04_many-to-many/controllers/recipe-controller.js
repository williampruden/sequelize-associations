const { Recipe, Ingredient } = require('../models/')

function index(req,res) {
  Recipe.findAll({
    include: [{
      model: Ingredient,
      as: 'ingredients',
      attributes: ['name'],
      through: {
        attributes: ['meassurementAmount', 'meassurementType']
      }
    }],
  })
  .then((recipe) => {
    return res.status(200).json(recipe)
  })
  .catch((error) => {
    console.log("ERRRRORORORORORORRR: ", error);
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Recipe.create({
    title: req.body.title,
    description: req.body.description,
    instructions: req.body.instructions
  })
  .then((recipe) => {
    return res.status(200).json(recipe)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Recipe.findById(req.params.id, {
      include: [{
        model: Ingredient,
        as: 'ingredients',
        attributes: ['name'],
        through: {
          attributes: ['meassurementAmount', 'meassurementType']
        }
      }]
    })
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe Not Found' });
      }

      return res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function update(req,res) {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe Not Found' });
      }

      recipe.update({
        ...recipe, //spread out existing recipe
        ...req.body //spread out req.body - the differences in the body will override the recipe returned from DB.
      })
      .then((recipe) => {
        res.status(200).json(recipe)
      })
      .catch((error) => {
        res.status(400).json(error)
      });
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function destroy(req,res) {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(400).json({ message: 'Recipe Not Found' });
      }
      recipe.destroy()
      .then((recipe) => {
        res.status(200).json(recipe)
      })
      .catch((error) => {
        res.status(400).json(error)
      });
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function addIngredientToRecipe(req, res) {
  Recipe.findById(req.params.recipeId)
    .then((recipe) => {
      if (!recipe) {
        return res.status(400).json({ message: 'Recipe Not Found' });
      }

      recipe.addIngredient(req.params.ingredientId, {
        through: {
          meassurementAmount: req.body.meassurementAmount,
          meassurementType: req.body.meassurementType
        }
      })
        .then((response) => {
          return res.status(200).json(response)
        })
        .catch((error) => {
          console.log("ERRRRORORORORORORRR: ", error);
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}


module.exports = { index, create, show, update, destroy, addIngredientToRecipe }
