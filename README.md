# Sequelize Version 4 Association Examples

### Sequelize
Currently Sequelize is the only SQL ORM for those developing in Node. While the technology is helpful the documentation and community generated tutorials can often be confusing. This repo is an attempt at showing concrete examples of how the ORM works with defining associations and querying based on those associations.

- I've chosen to use a PostgreSQL DB for these examples but Sequelize does offer support for [other DBs](http://docs.sequelizejs.com/manual/installation/getting-started.html) as well:
  - PostgreSQL
  - MySQL2
  - SQLite3
  - Tedious

### Sequelize-CLI
I've installed the [Sequelize CLI](https://github.com/sequelize/cli) globally on my local machine and recommend it as it helps speed up development.

Running the `sequelize init` command boiler plates out quite a few folders/files for you.
  - Config
    - config.json
  - Models
    - index.js
  - Migrations
  - Seeders

I've gone ahead and changed the `config.json` file to just include the url of each database rather than all the generated credentials that `sequelize init` will give you.  You will also notice in my `models/index.js` file that I have changed line 14 to only use the url rather than all of the other boiler plated credentials. Feel free to use whatever method best suits your need.

Lastly its worth mentioning that `sequelize init` will not generate the [.sequelizerc](http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-sequelizerc-file) file in the root of your application. The `sequelize-cli` needs this file in order to know where certain files and folders are located within your project. You will see that I have gone ahead and created that file in each example for you but if you plan on starting your own project please don't forget to include one with the appropriate paths to the files and folders you see in my example.

### Development Apps
For those of you who are interested in using PostgreSQL and are running a Mac, I would also recommend using the following apps as they have helped speed up development process:

  - [Postgres App](https://postgresapp.com/) - this app hosts the local server off of which PostgreSQL will run on your local machine.  Super easy to setup, just follow their instructions and you are off to the races.
  - [Postico](https://eggerapps.at/postico/) - this app is a GUI that allows you to create databases, perform CRUD operations inside of databases and view data within databases to ensure that your data is in fact persisting the way you intend it to.

### Folder Structure
Each folder has its own echo system designed to show one association each.
  - many-to-many - in Progress
  - one-to-many - *DONE*
  - one-to-one - BP out
  - zero-to-many - *DONE*
  - zero-to-one - BP out


### Many To Many
Tutorial content coming soon

### One to Many
Tutorial content coming soon

### One to One
Tutorial content coming soon

### Zero to Many
Tutorial content coming soon

### Zero to One
Tutorial content coming soon
