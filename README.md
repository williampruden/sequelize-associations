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
> NOTE: Each tutorial builds off the one before it so its recommended you do them in order to get the most.

  - [Overview](https://github.com/williampruden/sequelize-associations#overview)
  - [One-To-Many](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many)
  - [Zero-To-Many](https://github.com/williampruden/sequelize-associations/tree/master/02_zero-to-many)
  - [One-To-One](https://github.com/williampruden/sequelize-associations/tree/master/03_one-to-one)
  - [Many-To-Many](https://github.com/williampruden/sequelize-associations/tree/master/04_many-to-many)

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

Success! We have a PostgreSQL DB hooked up to our Node/Express application. In the coming tutorials we will explore how to create models, migrations, seeders, how to establish associations, and then query based on those associations. Sounds fun doesn't it? Let's go to learn more in the [One-To-Many Tutorial](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many)
