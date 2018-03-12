# One to Many
In this tutorial we will be:
- [Creating models](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many#creating-models)
- [Creating migrations](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many#creating-migrations)
- [Establishing associations](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many#establishing-associations)
- [Querying based on associations](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many#querying-based-on-associations)

## Creating Models
With our app setup, we are now ready to generate models. We are going to have two models, Users and Tasks. The relationship between a User and it's Tasks is going to be one-to-many. Another way of saying this is our User can have many Tasks but a Task can only belong to one User.

Lets utilize the power of Sequelize-CLI to generate these files for us.

```bash
> sequelize model:create --name User --attributes firstName:string,lastName:string,email:string
```
If you ran this successfully then you should have two new files.  Lets explore the model file it created for you.

`./models/user.js` should look like this:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
```

We are going to talk about what we changed and why but for now lets go ahead and update our file to look more like this:

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    }
  }, {
    paranoid: true
  });

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
```
There are a couple different attributes added to each of our user properties so lets explore each one:

- `allowNull`: this means that for a valid user to be posted to our database that this property is required.  We've made all three of our user's properties required.
- `unique`: this means that (in our case) emails must be unique in our database.  No two users can share the same email.
- `validate`: this topic is much wider and goes beyond the scope of what we are covering but in this case it is validating that the email provided follows typical email formating.  For more on validate check out [the docs](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations).
- `paranoid`: this means that no records will actually be deleted from the DB itself but instead a `deletedAt` timestamp will be applied and on future queries the record will be excluded from the results. This is often referred to as a soft delete.

So now that our app is aware of what a User model looks like we need to inform our database about what the User model looks like. In order to do this we need to explore migrations

## Creating Migrations
The sequelize command we ran a minute ago not only created our model file but it also created our migrations file.  Before we explore the migration that was created lets talk about why we need migrations and some rules to remember about them.

Just like you use Git to manage changes in your source code, you can use migrations to keep track of changes to your database. Every migration file has an `up` function and `down` function.  `up` is the desired change we wish to make to our database when we run the migration and `down` is the exact opposite of `up` should we choose to roll back the migration and reverse the change.

In a moment we will run our migrations by running `sequelize db:migrate` in our CLI. Running this migration will change the state of our database.  Right now if I explore the database for this app in Postico (my GUI) it will look empty.

<img src="https://i.imgur.com/n6hOk8K.png" align="center" />

But after I run the migrations you will see that the tables with the desired columns, constraints, and validations will appear.

<img src="https://i.imgur.com/VqiLa7n.png" align="center" />

Sure I could go into my GUI and configure all of this manually but if I am working on a team then there is a strong chance that my instance of the database will look different than my teammates. But if my teammate and I both run the same migrations then we can rest assured that our databases will be identical.

This brings me to a few rules to keep in mind about migrations:

- Never delete a migration after its been run. We might someday need the `down` function.
- Never edit a migration after its been run.  If you need to edit your database, create another migration to make the desired change.

Now lets take a look at the migration that was created for us `./migrations/<timestamp>-create-user.js`

```javascript
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```
We are going to talk about what we changed and why but for now lets go ahead and update our file to look more like this:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail : true
        },
        unique: true
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
    return queryInterface.dropTable('Users');
  }
};
```
We added in all of the same validations and constraints that were made to our model file.  The other obvious difference is that we added the `deletedAt` property and made `allowNull: true` instead of false.  This allows the property to sit there with a NULL value until the record is deleted at which point a time stamp is given. If you remember in our model file we added an attribute to the model itself called `paranoid`.  `paranoid` and `deletedAt` work together to create that soft delete functionality.

Now that our model and migration are complete we can run the migration by running `sequelize db:migrate`.

If you make a mistake you have a few options:

- Create a new migration by running `sequelize migration:generate` and in the new migration correct your error then run `sequelize db:migrate`
- Rollback your last migration with `sequelize db:migrate:undo`, edit the migration and then re-run `sequelize db:migrate`
- Rollback all of your migrations with `sequelize db:migrate:undo:all` and start from scratch. Use `sequelize db:migrate:undo:all` with caution as it cleans house.
- For more on migration commands check out [the docs](https://github.com/sequelize/cli#documentation).

## Establishing Associations
Now that our User is complete lets create our Task and establish the associations between the two.

Run: `sequelize model:create --name Task --attributes title:string,complete:boolean`

Update your files to match the following:

`./models/task.js`

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    paranoid: true
  });

  Task.associate = (models) => {
	// associations can be defined here
  };

  return Task;
};

```


`./migrations/<timestamp>-create-task.js`

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      complete: {
        type: Sequelize.BOOLEAN
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
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Tasks');
  }
};

```
Notice in the migrations file we added a new property to our Task called `userId`.  This will be the foreign key that sequelize uses when we perform queries.

The last steps in creating the associations happens in each model file. Update your code to each to match the following:

`./models/user.js`

```javascript
 ...
   User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    });
  };
 ...
```

`./models/task.js`

```javascript
...
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tasks'
    });
  };
...
```

A couple quick things worth mentioning before we start building out our controllers:

- The association has to be defined on both models.
- The `as` attribute is optional but I found incredibly helpful when querying my data.  Without it I'd get `Tasks` coming back in my JSON rather than `tasks`.
- The `allowNull: false` here means that a Task can't be created or live outside of the context of belonging to a User. More on that in the next tutorial.

Don't forget to `sequelize db:migrate` so that the Tasks table now shows up in your database.

## Querying based on associations

Before we can write the controller code we first need to make a route and controller for our Tasks and wire them up to our server.js

Create `./routes/tasks.js` and add the following code:

```javascript
const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task-controller')

// http://localhost:3000/tasks
router.get('/', taskController.index);
router.post('/', taskController.create);
router.get('/:id', taskController.show);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

module.exports = router;

```

Create `./controllers/task-controller.js` and add the following code:

```javascript
function index(req, res) {

}

function create(req, res) {

}

function show(req, res) {

}

function update(req, res) {

}

function destroy(req, res) {

}

module.exports = { index, create, show, update, destroy }

```

Require the tasks routes file on `./server.js` and mount them onto the server like this:

```javascript
...

const users = require('./routes/users');
const tasks = require('./routes/tasks');

...

app.use('/users', users);
app.use('/tasks', tasks);

...
```

### Creating A User

`./controllers/user-controller.js`

```javascript
const { User, Task } = require('../models/')

... 

function create(req,res) {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  })
  .then((user) => {
    return res.status(200).json(user)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}
```
Its important to require our models at the top of our controller file so we can access all the methods that Sequelize gives us access to.  In this example we are taking the request body that is passed in and creating a new instance of a User. My postman looks something like this:

### Listing All Users

`./controllers/user-controller.js`

```javascript
function index(req,res) {
  User.findAll({
    include: [{
      model: Task,
      as: 'tasks'
    }]
  })
  .then((user) => {
    return res.status(200).json(user)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}
```
<img src="https://i.imgur.com/OlekDI0.png" align="center" />

Since we have only made one user so far it should be returning an array with our one user inside of it.  You should also notice that this user has an empty array of tasks inside of him. When we say `User.findAll()` we pass in a configurable object where we can specify what we wish to include.  Since Users and Tasks have an established relationship we can call for Tasks to show up `as` tasks.  

If your app has multiple relationships with your User and you wish to have all of those relationships present in this query then you can create multiple objects inside of the `include:[]` property.  

Going one level deeper, lets imagine that Tasks has another model its associated with and we wish for that model to also return in this query.  Go ahead and include another `include:[]` inside of the Task object. Example:

```javascript
 User.findAll({
    include: [{
      model: Task,
      as: 'tasks',
      include: [{
        model: OtherModel,
        as: 'otherModel'
      }]
    }]
  })
```  

### Creating A Task

`./controllers/task-controller.js`

```javascript
const { User, Task } = require('../models/')

...

function create(req,res) {
  Task.create({
    title: req.body.title,
    complete: false,
    userId: req.body.userId
  })
  .then((task) => {
    return res.status(200).json(task)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}
```
If you attempt to create a task without a userId it should throw an error.  If you remember in our migration and Task model we stated `allowNull: false`.  This means that a task can not float around in our database without belonging to a user.  As we create this task lets set the userId to the user we just created.

<img src="https://i.imgur.com/ogvwCET.gif" />

### Listing All Tasks

`./controllers/task-controller.js`

```javascript
function index(req,res) {
  Task.findAll()
  .then((task) => {
    return res.status(200).json(task)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}
```
This should list all tasks in our database.  Feel free to make a few different Users and assign different Tasks to those Users.

<img src="https://i.imgur.com/xbwAqcW.png" align="center" />

### Showing Users and Tasks

`./controllers/user-controller.js`

```javascript
function show(req,res) {
  User.findById(req.params.id, {
      include: [{
        model: Task,
        as: 'tasks'
      }]
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
      }

      return res.status(200).json(user);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}
```
Now that we have a few users in our database we might run into moments where we just want to see one at a time.  We can use the `.findById()` method to query a single user and again passing in the configurable object we can include the Tasks associated with this user in the response.

<img src="https://i.imgur.com/Lq82SuV.png" align="center" />

`./controllers/task-controller.js`

```javascript
function show(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Task Not Found' });
      }

      return res.status(200).json(task);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}
```

### Updating Users and Tasks

`./controllers/user-controller.js`

```javascript
function update(req,res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
      }

      user.update({
        ...user, //spread out existing user
        ...req.body //spread out req.body - the differences in the body will override the user returned from DB.
      })
      .then((updatedUser) => {
        return res.status(200).json(updatedUser)
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}
```
<img src="https://i.imgur.com/WXf8L6V.png" align="center" />

`./controllers/task-controller.js`

```javascript
function update(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Task Not Found' });
      }

      task.update({
        ...task, //spread out existing task
        ...req.body //spread out body - the differences in the body will over ride the task returned from DB.
      })
      .then((updatedTask) => {
        return res.status(200).json(updatedTask)
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

```

<img src="https://i.imgur.com/XtpZHEp.png" align="center" />

### Deleting Users and Tasks

`./controllers/user-controller.js`

```javascript
function destroy(req,res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: 'User Not Found' });
      }

      user.destroy()
        .then((user) => {
          return res.status(200).json(user)
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}
```
<img src="https://i.imgur.com/LOJW446.gif" />

Notice here that if we check our database the record still exists.  What has changed though is that `deletedAt` has been given a timestamp and if you try to query that specific user it will tell you they no longer exist.

`./controllers/task-controller.js`

```javascript
function destroy(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(400).json({ message: 'Task Not Found' });
      }
      
      task.destroy()
        .then((task) => {
          return res.status(200).json(task)
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}
```