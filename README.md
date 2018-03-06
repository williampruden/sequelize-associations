# Sequelize Association Examples
### Seuqelize Version 4 code samples.

Sequelize is currently the only ORM for Node for people interested in working with relational databases.  While the technology is helpful the documentation and community generated tutorials can often be confusing.  This repo is an attempt at showing concrete examples of how the ORM works with defining associations and querying based on those associations.

- I've chosen to use a PostgreSQL DB for these examples but Sequelize does offer support for [other DBs](http://docs.sequelizejs.com/manual/installation/getting-started.html) as well:
  - PostgreSQL
  - MySQL2
  - SQLite3
  - Tedious

- Each folder has its own echo system designed to show one association each.
  - one-to-one
  - one-to-many
  - many-to-many

I've installed the [Sequelize CLI](https://github.com/sequelize/cli) and recommend it as it helps speed up development
Running the `sequelize init` command boiler plates out quite a few folders/files for you.
  - Config
    - config.json
  - Models
    - index.js
  - Migrations
  - Seeders

I've gone ahead and changed the config.json file to just include the url of each database rather than all the generated credentials that `sequelize init` will give you.  You will also notice in my `models/index.js` file that I have changed line 14 to only use the url rather than all of the other boiler plated credentials. Feel free to use whatever method best suits your need.

Lastly its worth mentioning that `sequelize init` will not generate the [`.sequelizerc`](http://docs.sequelizejs.com/manual/tutorial/migrations.html#the-sequelizerc-file) file in the root of your application. The `sequelize-cli` needs this file in order to know where certain files and folders are. You will see that I have gone ahead and created that file in each example for you but if you plan on starting your own project please don't forget to include one with the appropriate paths to the files and folders you see in my example.
