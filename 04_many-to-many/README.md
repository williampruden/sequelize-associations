# Many To Many
In this tutorial we will be:
- [Understanding Junction Tables.]()
- [Create Our App]()
- [How To Query Shared Data]()
- [Creating A New Relationship]()

## Understanding Junction Tables
When dealing with Many to Many relationships we need a Junction (or as I like to call it Mapping) Table to map (see what I did there?) together the relationships between both of our models. For example lets pretend we are building an app for a High School and we need to define the relationship between Teachers and Students. Well Teachers obviously teach more than one Student and I don't know about your high school but I had around 6-7 different teachers at a time. It wouldn't make sense to store the foreign key on either model so we need to create a Junction table called TeacherStudents that will keep track of those relationships. In this case every row will have 2 pieces of data, studentId and teacherId. One row represents one relationship. Behind the scenes sequelize will use this TeacherStudents table and allow us to access data we need. Sequelize will also supply us with some helper methods that we can utilize to create new relationships and we will explore some of these later.

## Creating Our App
We just talked about a High School app with Teachers and Students where the Junction Table only holds the foreign keys.  But what happens when we want to store more information about the relationship in the Junction Table?  We will be building a Recipe App that stores Recipe and Ingredient data. Just knowing what Ingredients belong to which Recipes isn't enough. We need to know how much of that Ingredient each Recipe will need and the best place for that data, you guessed it, is in the Junction Table.

The assumption as we get started is that you have a brand new Node app and have gone through the basic configuration in the [Overview Tutorial](https://github.com/williampruden/sequelize-associations). Also don't forget to create a new database and in your `./config/config.json` update which database you are pointing to. Here is a quick snapshot of what my `./config/config.json` looks like.

```javascript
{
  "development": {
    "url": "postgres://postgres:password@localhost:5432/sql_mtm_dev",
    "dialect": "postgres"
  },
  "test": {
    "url": "postgres://postgres:password@localhost:5432/sql_mtm_test",
    "dialect": "postgres"
  },
  "staging": {
    "url": "postgres://postgres:password@localhost:5432/sql_mtm_staging",
    "dialect": "postgres"
  },
  "production": {
    "url": "postgres://postgres:password@localhost:5432/sql_mtm_production",
    "dialect": "postgres"
  }
}
```

Since we went into great detail on how to create models, controllers and migrations in the [One-To-Many](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many) we are going to move kind of quickly through that content here.

Update your `./server.js` to look like:

```javascript
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const models = require('./models/');

const recipes = require('./routes/recipes');
const ingredients = require('./routes/ingredients');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recipes', recipes);
app.use('/ingredients', ingredients);

models.sequelize
  .authenticate()
  .then(function () {
    console.log('Connection successful');
  })
  .catch(function(error) {
    console.log("Error creating connection:", error);
  });

module.exports = app;
```

Create `./routes/recipes.js` to look like:

```javascript
var express = require('express');
var router = express.Router();

const recipeController = require('../controllers/recipe-controller')

// http://localhost:3000/recipes
router.get('/', recipeController.index);
router.post('/', recipeController.create);
router.get('/:id', recipeController.show);
router.put('/:id', recipeController.update);
router.delete('/:id', recipeController.destroy);

module.exports = router;
```

Create `./routes/ingredients.js` to look like:

```javascript
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
```

Update your `./controllers/recipe-controller.js` to look like:

```javascript
const { Recipe, Ingredient } = require('../models/')

function index(req,res) {

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
      .then((updatedRecipe) => {
        return res.status(200).json(updatedRecipe)
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
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(400).json({ message: 'Recipe Not Found' });
      }

      recipe.destroy()
        .then((recipe) => {
          return res.status(200).json(recipe)
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
```

Update your `./controllers/ingredient-controller.js` to look like:

```javascript
const { Recipe, Ingredient } = require('../models/')

function index(req,res) {

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
```

Run the following commands:

```bash
> sequelize model:create --name Recipe --attributes title:string,description:text,instructions:text
> sequelize model:create --name Ingredient --attributes name:string
> sequelize model:create --name RecipeIngredient
```

Update your `./models/ingredient.js` to look like:

```javascript
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
```

Update your `./models/recipe.js` to look like:

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  const Recipe = sequelize.define('Recipe', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Recipe.associate = (models) => {
    Recipe.belongsToMany(models.Ingredient, {
      through: "RecipeIngredient",
      foreignKey: 'recipeId',
      as: 'ingredients'
    });
  };

  return Recipe;
};
```

Update your `./models/recipe-ingredient.js` to look like:

```javascript
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
```

<!-- More info about how the relationships are described above  -->

## Querying Shared Data


## Creating A New Relationship

Incredibly helpful tutorial and many thanks to https://github.com/josie11/Sequelize-Association-Example/blob/master/server/index.js
