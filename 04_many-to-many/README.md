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
  Ingredient.findAll()
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
  Ingredient.findById(req.params.id)
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
Theres a lot to discuss in the last three code blocks above so lets break things down.

`belongsToMany` is how we establish the relationship between Recipes and Ingredients `through` the Junction Table named RecipeIngredient. As you probably already noticed we also have a model for that Junction Table.  Typically that model would only have attributes for the foreign keys but in our case we have additional data we wish to store about each relationship.  More specifically we are interested in the `meassurementType` and `meassurementAmount` for each relationship.  Its not enough to know that our recipe requires chicken.  I want to know that it requires 3 pounds of chicken.

Update your `./migrations/<timestamp>-create-recipe.js` to look like:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Recipes');
  }
};
```

Update your `./migrations/<timestamp>-create-ingredient.js` to look like:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Ingredients');
  }
};
```

Update your `./migrations/<timestamp>-create-recipeingredient.js` to look like:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('RecipeIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recipeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Recipes',
          key: 'id',
          as: 'recipes'
        }
      },
      ingredientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ingredients',
          key: 'id',
          as: 'ingredients'
        }
      },
      meassurementAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      meassurementType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('RecipeIngredients');
  }
};
```
Nothing too shocking about the way these migrations are laid out after taking a deeper look at the models.

## Querying Shared Data
Couple new concepts being introduced here as we explore querying through our Junction Table. The `attributes` concept we are about to see can be applied to all of our previous tutorials while `through` is a bit more specific to the Many-to-Many relationship. Enough talk lets see some code.

### Listing All Recipes
Add the following code to your `./controllers/recipe-controller.js`:
```javascript
function index(req,res) {
  Recipe.findAll({
    include: [{
      model: Ingredient,
      as: 'ingredients',
      attributes: ['name'],
      through: {
        attributes: []
      }
    }],
  })
  .then((recipe) => {
    return res.status(200).json(recipe)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}
```

As you can see here we are using `include` to get our ingredients and we are using the new `attributes` modifier to be specific about what we want from ingredients. I encourage you to run some queries with this and without this to see the difference for yourself.  You should see the possibilities available to you rather quickly.  Other thing to note here is the new `through` modifier thats shown up.  It allows us to request additional information about the relationship if there is any.  In our case we have `meassurementType` and `meassurementAmount` available to us but we will not need either for this more generic query. Lets take a look at the `show` function to utilize the power of `through`.

### Listing One Recipe
Add the following code to your `./controllers/recipe-controller.js`:

```javascript
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
```

As you can see here we want those additional pieces of information so we have gone ahead and included them into our `attributes` inside of `through`.  Run the query and you can see them show up.  Play around with different versions of this so you can see how they work and get a stronger sense of whats possible.

## Creating A New Relationship
Now that we know how to query the data when its there its important to understand how to establish those relationships inside of the join table.  For this we need to understand some more of the methods that Sequelize provides us with.  In our case every instance of `recipe` has quite a few new methods available to us but we are going to look at just 2, `getIngredients()` and `addIngredient()`.  For more on all the methods available please refer to [the docs](http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html).

In one of our recipe queries if we ever want to produce a list of the ingredients associated with it we can now say something like `recipe.getIngredients()` which will return that list.  If we ever want to add a new ingredient to an existing recipe we can say something like `recipe.addIngredient(...)` and it will create that relationship.  Lets see this in action.

Go ahead and add a new function at the bottom of your `./controllers/recipe-controller.js`:

```javascript
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
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

module.exports = { index, create, show, update, destroy, addIngredientToRecipe }
```

Also you will need to add the following route in your `./routes/recipes.js` file:

```javascript
...
router.post('/:recipeId/ingredients/:ingredientId', recipeController.addIngredientToRecipe);

module.exports = router;
```

A lot is going on here so lets break it down.
- We are using the route param `recipeId` to first query our DB and find the recipe.
- Once we have the instance of the recipe we were looking for we will use `.addIngredient()` method to add the ingredient found in the route param under `ingredientId`.
- At the same time we have the option to pass in the additional data we need to help describe this new relationship with the `through` object.

Once you have this working go ahead and query your data to make sure the new relationships are working as intended.

Well that brings us to the end of this 5 part tutorial. There are a few relationships we didn't explore but given the topics we have gone over I'm confident that you can make them work on your own. If you have any questions or thoughts feel free to shoot me an email at: **williamprudeniv@gmail.com**.

Best of luck and happy coding!
