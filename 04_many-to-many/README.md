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

## Querying Shared Data
 

## Creating A New Relationship

Incredibly helpful tutorial and many thanks to https://github.com/josie11/Sequelize-Association-Example/blob/master/server/index.js
