# Sequelize Version 4 Association Examples

## Sequelize
Sequelize is a SQL ORM for those developing in Node. This repo is a set of tutorials showing concrete examples of how the ORM works with defining associations and querying based on those associations. The examples provided are intentionally simplistic and focused on demonstrating what Sequelize is capable of.

I've chosen to use a PostgreSQL DB for these examples but Sequelize does offer support for [other DBs](http://docs.sequelizejs.com/manual/installation/getting-started.html) as well:

  - PostgreSQL
  - MySQL2
  - SQLite3
  - Tedious

## Before We Start
Lets take a look at the tools and technologies we will be using:

- [Node](https://nodejs.org/en/) **v8.9.4** - We're going to use this to run JavaScript code on the server.

- [Express](https://expressjs.com/) **v4.13.4** - As their website states, Express is a "Fast, unopinionated, minimalist web framework for Node.js". If you've been in the Node community for any time at all you should be familiar with how wonderful Express is.  If you are new - then welcome!

- [PostgreSQL](https://www.postgresql.org/docs/9.6/static/index.html) **v9.6.5** - Powerful open-source database that we're going to use for all of our tutorials. Unfortunately, details on how to install and configure PostgreSQL on your particular system are out of the scope of what this tutorial will cover.  That being said if you find yourself using a Mac - I have a few recommondations on complimentary tools that I have found useful.
	- [Postgres App](https://postgresapp.com/) - this app hosts the local server off of which PostgreSQL will run on your local machine.  Super easy to setup, just follow their instructions and you are off to the races.
	- [Postico](https://eggerapps.at/postico/) - this app is a GUI that allows you to create databases, perform CRUD operations inside of databases and view data within databases to ensure that your data is in fact persisting the way you intend it to.

- [Sequelize](http://docs.sequelizejs.com/) **v4.35.0** - The reason we are all here.  If you haven't heard of it by now then you're in the wrong tutorial.

- [Sequelize-CLI](https://github.com/sequelize/cli) **v4.0.0** - A wonderful CLI tool to interface with sequelize. Go ahead and install this onto your machine by typing `npm install -g sequelize-cli` into your CLI

- [Postman](https://www.getpostman.com/docs/v6/postman/launching_postman/navigating_postman) - A Chrome app that we'll use to test our API.

This tutorial assumes an understanding of:

- JavaScript
- ES2015 syntax
- Node/Express basics
- NPM basics
- CLI

## Tutorials
Each folder has its own echo system designed to show one association each. Tutorials and explanations provided for each folder below.

  - [Overview](https://github.com/williampruden/sequelize-associations#overview)
  - [Many-To-Many](https://github.com/williampruden/sequelize-associations#many-to-many)
  - [One-To-Many](https://github.com/williampruden/sequelize-associations#one-to-many)
  - [One-To-One](https://github.com/williampruden/sequelize-associations#one-to-one)
  - [Zero-To-Many](https://github.com/williampruden/sequelize-associations#zero-to-many)

## Overview
If you are familiar with Sequelize and wish to download the repo and play with the existing code then you will need to do the following in order to get the projects up and running.

- create a database on your machine that matches the development url in `./config/config.json`
- run `npm install` in your CLI
- run `sequelize db:migrate` in your CLI
- run `npm start` in your CLI
- Peek at some of the association specific tutorials as they will help provide clarity on how each one works.

If the instructions above are confusing, fear not, we are going to start from scratch to give you an idea of how to build these apps from the ground up.  

Please clone the [Node-Simple-Starter](https://github.com/williampruden/node-simple-starter) repository as this will be our base for each of our apps.

```bash
> npm install
> npm install --save sequelize pg pg-hstore
```

`pg` will be responsible for creating the database connection while `pg-hstore` is for serializing and deserializing JSON data into the Postgres hstore format and `sequelize` is our ORM... but you already knew that. If you plan on using a DB other than PostgreSQL please refer to the [sequelize docs](http://docs.sequelizejs.com/manual/installation/getting-started.html) for what to install.

Now that our Node app is up and running we can focus on why we are all here - Sequelize! With our `sequelize-cli` installed globally and `sequelize` installed locally to our project we can now run our first sequelize command. In your CLI run `sequelize init` and notice what happens. It has added the folders `config`, `models`, `migrations`, and `seeders` along with a few other files which we will explore in a bit.  Quick sanity check - our file structure should look like this:

```bash
.
├── bin
│   └── www
├── config
│   └── config.json
├── controllers
│   └── user-controller.js
├── migrations
├── models
│   └── index.js
├── package-lock.json
├── package.json
├── routes
│   └── users.js
├── seeders
└── server.js
```

It's worth mentioning that `sequelize init` will not generate a [.sequelizerc](http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-sequelizerc-file) file in the root of our application. The `sequelize-cli` needs this file in order to know where certain files and folders are located within our project. Go ahead and create a `.sequelizerc` file in the root of the application and add the following code:

```javascript
var path = require('path');

module.exports = {
  'config': path.resolve('./', 'config/config.json'),
  'migrations-path': path.resolve('./', 'migrations'),
  'seeders-path': path.resolve('./', 'seeders'),
  'models-path': path.resolve('./', 'models')
};
```

The `config.json` file contains our application configuration settings, in short this file holds the info needed to connect to our actual DB. `migrations` will hold our application's migrations - much more on what migrations are a little later. `models` is where we will create and define our app's models. `seeds` is something we will touch on briefly but in short seed data is the initial data we provide our app for testing purposes.

We will see the benefits of `.sequelizerc` a little later but for now lets explore the files that `sequelize init` generated for us.

`./models/index.js` should look like this:

```javascript
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

Summary of what is happening here:

- We are requiring the modules we're going to be using.
- Reading the configuration specific to our current Node environment and if we don't have a Node environment defined, we're defaulting to development.
- Establishing a connection with our database.
- Read our models folder, importing all the models in it, adding them to the db object and applying relationships between the models, if those relationships exist.

`./config/config.json` should look like this:

```javascript
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
I refactor mine to look more like this:

```javascript
{
  "development": {
    "url": "postgres://postgres:password@localhost:5432/sql_otm_dev",
    "dialect": "postgres"
  },
  "test": {
    "url": "postgres://postgres:password@localhost:5432/sql_otm_test",
    "dialect": "postgres"
  },
  "staging": {
    "url": "postgres://postgres:password@localhost:5432/sql_otm_staging",
    "dialect": "postgres"
  },
  "production": {
    "url": "postgres://postgres:password@localhost:5432/sql_otm_production",
    "dialect": "postgres"
  }
}
```
Notice we changed the `dialect` to match our DB.  Again if you chose a different DB, then please specify the `dialect` that suits your project here. The `url` property contains all the details needed to connect to the DB. The only other change that then needs to take place now is in our `./models/index.js` file.  We need to read that `url` property instead of the `database`, `username`, and `password`.

```javascript
...

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.url, config);
}

...
```

Now all we need to do is create a DB and establish our connection. If PostgreSQL is installed you should be able to run the command `createdb sql-otm-dev` and this will create our db `sql-otm-dev`.  If you have [Postico](https://eggerapps.at/postico/) working then you can also create a DB this way.

**GIPHY HERE**

Last step is to establish that connection with the database and to do that we need to add the following code to the bottom of our `server.js` file.

```javascript
...
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const models = require('./server/models/');

...

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

Now if we run `npm start` it should look something like this.

**GIPHY HERE**

Success! We have a PostgreSQL DB hooked up to our Node/Express application. In the coming tutorials we will explore how to create models, migrations, seeders, how to establish associations, and then query based on those associations. Sounds fun doesn't it?

## One to Many
In this tutorial we will be:
- Creating models
- Creating migrations
- Establishing associations
- Querying based on associations
- Exploring when we would use a one to many relationship

### Creating Models
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

We are going to talk about what to change and why but for now lets go ahead and update our file to look more like this:

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
- `paranoid`: this means that no records will actually be deleted from the DB itself but instead a `deletedAt` timestamp will be applied and on future queries the record will be excluded from the results. This is often refered to as a soft delete.

So now that our app is aware of what a User model looks like we need to inform our database about what the User model looks like. In order to do this we need to explore migrations

### Creating Migrations
The sequelize command we ran a minute ago not only created our model file but it also created our migrations file.  Before we explore the migration that was created lets talk about why we need migrations and some rules to remember about them.

Just like you use Git to manage changes in your source code, you can use migrations to keep track of changes to your database. Every migration file has an `up` function and `down` function.  `up` is the desired change we wish to make to our database when we run the migration and `down` is the exact opposite of `up` should we choose to roll back the migration and reverse the change.

In a moment we will run our migrations by running `sequelize db:migrate` in our CLI. Running this migration will change the state of our database.  Right now if I explore the database for this app in Postico (my GUI) it will look empty.

**PIC OF POSTICO**

But after I run the migrations you will see that the tables with the desired columns, constraints, and validations will appear.

**PIC OF POSTICO**

Sure I could go into my GUI and configure all of this manually but if I am working on a team then there is a strong chance that my instance of the database will look different than my teammates. But if my teammate and I both run the same migrations then we can rest assured that our databases will be identical.

This brings me to a few rules to keep in mind about migrations:

- Never delete a migration after its been run. We might someday need the `down` function.
- Never edit a migration after its been run.  If you need to edit your database, create another migration to make the desired change.

Now lets take a look at the migration that was created for us `./migrations/<timestamp>-create-user.js` should look like:

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
We are going to talk about what to change and why but for now lets go ahead and update our file to look more like this:

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
We added in all of the same validations and constraints that were made to our model file.  The other glaring difference is that we added the `deletedAt` property and made `allowNull: true` instead of false.  This allows the property to sit there with a NULL value until the record is deleted at which point a time stamp is given. If you remember in our model file we added an attribute to the model itself called `paranoid`.  `paranoid` and `deletedAt` work together to create that soft delete functionality.

Now that our model and migration are complete we can run the migration by running `sequelize db:migrate` in our CLI.  

If you make a mistake you have two options:
 
- Create a new migration by running `sequelize migration:generate` and in the new migration correct your error then run `sequelize db:migrate` 
- Rollback your last migration with `sequelize db:migrate:undo` or rollback all of your migrations `sequelize db:migrate:undo:all`. Use `sequelize db:migrate:undo:all` with caution as it cleans house.
- For more on migration commands check out [the docs](https://github.com/sequelize/cli#documentation)

### Establishing Associations
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
Notice in the migrations file we added a new property to our task called `userId`.  This will be the foreign key that sequelize uses when we perform queries.

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
- The `as` attribute is optional but I found incredibly helpful when querying my data.  Without it I'd get `Tasks` coming back in my json rather than `tasks`.
- The `allowNull: false` here means that a Task can't be created or live outside of the context of belonging to a User. More on that in the next tutorial.

Don't forget to `sequelize db:migrate` so that the Tasks table now shows up in your database.

### Querying based on associations

## Zero to Many
In this tutorial we will be:
- Reviewing concepts from our previous tutorial
- Creating seed files
- Exploring when we would use a zero(or one) to many relationship

### Creating seed files


## One to One
In this tutorial we will be:
- Reviewing concepts from our previous tutorials
- Exploring when we would use a one to one relationship

## Many To Many
In this tutorial we will be:
- Reviewing concepts from our previous tutorials
- How to establish mapping tables with unique values
- How to query through the mapping tables and either include or exclude those unique values.
- Exploring when we would use a many to many relationship

### Establish mapping tables


Incredibly helpful tutorial and many thanks to https://github.com/josie11/Sequelize-Association-Example/blob/master/server/index.js
