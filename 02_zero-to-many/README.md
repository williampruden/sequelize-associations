# Zero to Many
In this tutorial we will be:
- [Understand differences between Zero to Many and One To Many](https://github.com/williampruden/sequelize-associations/tree/master/02_zero-to-many#differences)
- [Create Our App](https://github.com/williampruden/sequelize-associations/tree/master/02_zero-to-many#creating-our-app)
- [Creating Seed Files](https://github.com/williampruden/sequelize-associations/tree/master/02_zero-to-many#creating-seed-files)

## Differences
Before we dive into the code lets first consider the differences between the One-To-Many and Zero-To-Many relationships on a theoretical level. In our last tutorial we explored the relationship between Users and Tasks and what we ran into on several occasions was that Tasks couldn't exist outside of the context of belonging to a User. The foreign key for userId was a mandatory part of what it meant to be a Task. There were no Tasks floating around without an owner. But what if we wanted that.  

In this tutorial we will be exploring the relationship between. Users and Projects and in this case we do want Projects relationship with Users to be optional. In other words, Projects can exist and stand on their own and at the same time have the option to relate to a User.

Now that we are clear on the differences lets get to building.

## Creating Our App
The assumption as we get started is that you have a brand new Node app and have gone through the basic configuration in the [Overview Tutorial](https://github.com/williampruden/sequelize-associations). Also don't forget to create a new database and in your `./config/config.json` update which database you are pointing to. Here is a quick snapshot of what my `./config/config.json` looks like.

```javascript
{
  "development": {
    "url": "postgres://postgres:password@localhost:5432/sql_ztm_dev",
    "dialect": "postgres"
  },
  "test": {
    "url": "postgres://postgres:password@localhost:5432/sql_ztm_test",
    "dialect": "postgres"
  },
  "staging": {
    "url": "postgres://postgres:password@localhost:5432/sql_ztm_staging",
    "dialect": "postgres"
  },
  "production": {
    "url": "postgres://postgres:password@localhost:5432/sql_ztm_production",
    "dialect": "postgres"
  }
}
```

Since we went into great detail on how to create models, controllers and migrations in [the last tutorial](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many) we are going to move kind of quickly through that content here.

Update your `./server.js` to look like:

```javascript
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const models = require('./models/');

const projects = require('./routes/projects');
const users = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/projects', projects);
app.use('/users', users);

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

Create `./routes/projects.js` to look like:

```javascript
var express = require('express');
var router = express.Router();

const projectController = require('../controllers/project-controller')

// http://localhost:3000/projects
router.get('/', projectController.index);
router.post('/', projectController.create);
router.get('/:id', projectController.show);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.destroy);

module.exports = router;
```

Update your `./controllers/user-controller.js` to look like:

```javascript
const { User, Project } = require('../models/')

function index(req,res) {
  User.findAll({
    include: [{
      model: Project,
      as: 'projects'
    }],
  })
  .then((user) => {
    return res.status(200).json(user)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

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

function show(req,res) {
  User.findById(req.params.id, {
      include: [{
        model: Project,
        as: 'projects'
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

module.exports = { index, create, show, update, destroy }
```

Update your `./controllers/project-controller.js` to look like:

```javascript
const { User, Project } = require('../models/')

function index(req,res) {
  Project.findAll()
  .then((project) => {
    return res.status(200).json(project)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Project.create({
    title: req.body.title,
    description: req.body.description,
    complete: req.body.complete
  })
  .then((project) => {
    return res.status(200).json(project)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(404).json({ message: 'Project Not Found' });
      }

      return res.status(200).json(project);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(404).json({ message: 'Project Not Found' });
      }

      project.update({
        ...project, //spread out existing project
        ...req.body //spread out body - the differences in the body will over ride the project returned from DB.
      })
      .then((updatedProject) => {
        return res.status(200).json(updatedProject)
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
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(400).json({ message: 'Project Not Found' });
      }

      project.destroy()
        .then((project) => {
          return res.status(200).json(project)
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
> sequelize model:create --name User --attributes firstName:string,lastName:string,email:string
> sequelize model:create --name Projects --attributes title:string,description:string,complete:boolean
```

Update your `./models/project.js` to look like:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
  paranoid: true
});

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: true
      },
      as: 'projects'
    });
  };

  return Project;
};
```

Update your `./models/user.js` to look like:

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
      }
    }
  }, {
  paranoid: true
});

  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: {
        name: 'userId',
        allowNull: true
      },
      as: 'projects'
    });
  };

  return User;
};
```

Update your `./migrations/<timestamp>-create-project.js` to look like:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Projects', {
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
        type: Sequelize.STRING,
        allowNull: false
      },
      complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Projects');
  }
};
```

Update your `./migrations/<timestamp>-create-user.js` to look like:

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
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
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

Notice that the only real difference is that when we define the relationship and foreign key we are saying `allowNull: true` instead of false like we did in the previous tutorial.

This allows the field to be left empty which means Projects can stand on their own.

Go ahead and test this on your own.
- Create a project in Postman and don't pass give it a userId.
- Create a user and query the user to see the projects array is empty.
- Now update the project by adding in the userId.
- Now query that same user and see the project is included in the response.

## Creating Seed Files
We aren't going to go into too much detail on Seed files but I wanted to do a brief introduction so you have a reference of what they are and how they work.  If you want more [the docs](https://github.com/sequelize/cli#usage) are always a great place to start.

```bash
> sequelize seed:generate --name create-users
```

This will create `./seeders/<timestamp>-create-users.js` that looks like:

```javascript
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
```

Similar `up` and `down` functions that we are used to seeing in our migrations file.  Nothing too new here so lets go ahead and update the file to look like this:

```javascript
'use strict';
module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName : 'Erlich',
      lastName : 'Bachman',
      email : 'bachmanity.insanity@yahoo.com'
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', [{
      firstName :'Erlich'
    }])
  }
};
```
Once you have created as many user's as you need for testing purposes go ahead and run `sequelize db:seed:all` and check your database's GUI to see if it worked.

If you need to undo the seed file you have these two commands available to you.

- `sequelize db:seed:undo`
- `sequelize db:seed:undo:all`


Thats it for Zero-To-Many!  See you over at [One-To-One](https://github.com/williampruden/sequelize-associations/tree/master/03_one-to-one) for more on all things Sequelize!
