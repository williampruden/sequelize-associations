# Sequelize Version 4 Association Examples

## Sequelize
Currently Sequelize is the only SQL ORM for those developing in Node. While the technology is powerful the documentation and community generated tutorials can often be confusing, leaving out key files, steps, or code snippets needed to fully understand. This repo is an attempt at showing concrete examples of how the ORM works with defining associations and querying based on those associations. The examples provided are intentionally simplistic and are purely focused on demonstrating what Sequelize is capable of.

I've chosen to use a PostgreSQL DB for these examples but Sequelize does offer support for [other DBs](http://docs.sequelizejs.com/manual/installation/getting-started.html) as well:

  - PostgreSQL
  - MySQL2
  - SQLite3
  - Tedious

## Before We Start
Lets take a look at the tools and technologies we will be using:

- [Node](https://nodejs.org/en/) **v8.9.4** - We're going to use this to run JavaScript code on the server. 

- [Express](https://expressjs.com/) **v4.13.4** - As their website states, Express is a "Fast, unopinionated, minimalist web framework for Node.js". If you've been in the Node community for any time at all you should be familiar with how wonderful Express is.  If you are new - then welcome!

- [Express-generator](https://www.npmjs.com/package/express-generator) **v4.15.5** - One of the fastest ways to get an express app up off the ground.  Go ahead and install this onto your machine by typing `npm install -g express-generator` into your command line


- [PostgreSQL](https://www.postgresql.org/docs/9.6/static/index.html) **v9.6.5** - Powerful open-source database that we're going to use for all of our tutorials. Unfortunately, details on how to install and configure PostgreSQL on your particular system are out of the scope of what this tutorial will cover.  That being said if you find yourself using a Mac - I have a few recommondations on complimentary tools that I have found useful. 
	- [Postgres App](https://postgresapp.com/) - this app hosts the local server off of which PostgreSQL will run on your local machine.  Super easy to setup, just follow their instructions and you are off to the races.
	- [Postico](https://eggerapps.at/postico/) - this app is a GUI that allows you to create databases, perform CRUD operations inside of databases and view data within databases to ensure that your data is in fact persisting the way you intend it to.

- [Sequelize](http://docs.sequelizejs.com/) **v4.35.0** - The reason we are all here.  If you haven't heard of it by now then you're in the wrong tutorial.

- [Sequelize-CLI](https://github.com/sequelize/cli) **v4.0.0** - A wonderful command line tool to interface with sequelize. Go ahead and install this onto your machine by typing `npm install -g sequelize-cli` into your command line

- [Postman](https://www.getpostman.com/docs/v6/postman/launching_postman/navigating_postman) - A Chrome app that we'll use to test our API.

This tutorial assumes an understanding of:

- JavaScript
- ES2015 syntax
- Node/Express basics
- NPM basics 
- Command Line 

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
- run `npm install` in your cli
- run `sequelize db:migrate` in your cli
- run `npm start` in your cli
- Peek at some of the association specific tutorials as they will help provide clarity on how each one works.

If the instructions above are confusing, fear not, we are going to start from scratch to give you an idea of how to build these apps from the ground up.  

Express-generator, which we installed earlier, allows us to create lightweight express apps. It enables us to say something like `express <app-name>` in our command line.  This will create a brand new folder named after your `<app-name>`.

I always make sure I am on my Desktop in my command line when doing this.  Lets run `express one-to-many` together.

**GIPHY HERE**

This should generate the following repository for you:

```bash
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

Go ahead and remove `views`, `public`, and `routes/users.js`.  Rename your `app.js` to `server.js` Your repository should now look like this:

```bash
.
├── server.js
├── bin
│   └── www
├── package.json
└── routes
    └── index.js
```

Update your `./bin/www` to look like:

```javascript
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../server');
var debug = require('debug')('sql-test:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
 server.listen(port, () => {
   console.log("The server is live over on port: " + port);
 });
 server.on('error', onError);
 server.on('listening', onListening);
 
 ...

```

`var app` is now looking for server.js instead of app.js and we added the call back function to our `server.listen()`

Update your `./server.js` to look like:

```javascript
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
```

Express-generator's boiler plate is set up to support server side rendering which we won't need for this project so I remove quite a bit from server.js.

In your `./package.json` file remove the line `"jade": "~1.11.0",`.  Jade is a templating engine to support views.  Again we won't have views so its not needed.

Now that we have stripped away quite a bit of code its time to start building.  Run `npm install` to install the packages found in our `./package.json`.  

Lets install sequelize and our PostgreSQL client by running `npm install --save sequelize pg pg-hstore`

`pg` will be responsible for creating the database connection while `pg-hstore` is for serializing and deserializing JSON data into the Postgres hstore format.

If you plan on using a different database please refer to the [sequelize docs](http://docs.sequelizejs.com/manual/installation/getting-started.html) as to what to install.

With our `sequelize-cli` installed globally and `sequelize` installed locally to our project we can now run our first sequelize command to get things started.  In your command line run `sequelize init` and notice what happens. It has added the folders `config`, `models`, `migrations`, and `seeders` along with a few other files which we will explore in a bit.  Quick sanity check.  Our file structure should now look like:

```bash
.
├── server.js
├── bin
│   └── www
├── config
│   └── config.json
├── migrations
├── models
│   └── index.js
├── package-lock.json
├── package.json
├── routes
│   └── index.js
└── seeders
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

We will see the true power of this file later but for now lets explore those files that `sequelize init` did generate for us.

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
There is a lot going on in this file but in short:

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
The url property contains all the details needed to connect to the DB.  The only other change that then needs to take place is in my `./models/index.js` file I have to update a few lines to read that url property.

```javascript
...

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.url, config);
}

...
```

Now all we need to do is create a DB and establish our connection. If PostgreSQL is installed you should be able to run the command `createdb sql-otm-dev` and this will create our db `sql-otm-dev`.  If you got [Postico](https://eggerapps.at/postico/) working then you can also create a DB this way.

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

Success! We have a PostgreSQL DB hooked up to our Node/Express application. In the comming tutorials we will explore how to create models, migrations, seeders, how to establish associations, and then query based on those associations. Sounds fun doesn't it?

## One to Many
Tutorial content coming soon

## Zero to Many
Tutorial content coming soon

## One to One
Tutorial content coming soon

## Many To Many
Tutorial content coming soon

Incredibly helpful tutorial and many thanks to https://github.com/josie11/Sequelize-Association-Example/blob/master/server/index.js
