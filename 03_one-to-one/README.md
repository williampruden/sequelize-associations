# One to One
In this tutorial we will be:
- [Looking at When to use One to One relationships.]()
- [Create Our App.]()

## When to use One to One Relationships
It can be a bit of a tricky question.  Often times if we have a One-to-One relationship the thought of combining the data into one model follows shortly after. So when should we establish the these types of relationships? The answer as you may have guessed is a bit more artistic than dogmatic. A few scenarios I've come across:

  - **Efficiency/Sparseness:** I have 10 million users in my database but less than 1% of them need to ever provide certain data about themselves (lets say its medical disability data). The space you could save by breaking that data out into its own table is worth establishing the One(orZero) to One relationship.
  - **Auditing:** I have a User table with 25 columns and each user must have an address associated with them which makes up 6 of those 25. A business requirement comes across your desk saying you must audit the address data for the users. Or in other words if the user updates their address we want to know what the previous data used to be. This would be a good example of when to break the address data for the user into a new table and establish that relationship. Now we can audit that entire table rather than auditing the entire User table for just those rows.
  - **Restrictions:** I'm making a piece of software for accountants and want them to only have write and read access to certain data. For example they shouldn't be able to change dollar amounts, account numbers, or dates. If they make a mistake they must create a corrective record to add to the ledger. Other data in this app can be updated and deleted. This would be a good example of when to create a One to One relationship so that different constraints can be applied to different tables.

## Creating Our App
We are going to create an app where Users have a One-To-One relationship with Passports. The assumption as we get started is that you have a brand new Node app and have gone through the basic configuration in the [Overview Tutorial](https://github.com/williampruden/sequelize-associations). Also don't forget to create a new database and in your `./config/config.json` update which database you are pointing to. Here is a quick snapshot of what my `./config/config.json` looks like.

```javascript
{
  "development": {
    "url": "postgres://postgres:password@localhost:5432/sql_oto_dev",
    "dialect": "postgres"
  },
  "test": {
    "url": "postgres://postgres:password@localhost:5432/sql_oto_test",
    "dialect": "postgres"
  },
  "staging": {
    "url": "postgres://postgres:password@localhost:5432/sql_oto_staging",
    "dialect": "postgres"
  },
  "production": {
    "url": "postgres://postgres:password@localhost:5432/sql_oto_production",
    "dialect": "postgres"
  }
}
```
Since we went into great detail on how to create models, controllers and migrations in the [One To Many Tutorial](https://github.com/williampruden/sequelize-associations/tree/master/01_one-to-many) we are going to move kind of quickly through that content here.

Update your `./server.js` to look like:

```javascript
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const models = require('./models/');

const passports = require('./routes/passports');
const users = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/passports', passports);
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

Create `./routes/passports.js` to look like:

```javascript
var express = require('express');
var router = express.Router();

const passportController = require('../controllers/passport-controller')

// http://localhost:3000/passports
router.get('/', passportController.index);
router.post('/', passportController.create);
router.get('/:id', passportController.show);
router.put('/:id', passportController.update);
router.delete('/:id', passportController.destroy);

module.exports = router;
```

Update your `./controllers/user-controller.js` to look like:

```javascript
const { Passport, User } = require('../models/')

function index(req,res) {
  User.findAll({
    include: [{
      model: Passport,
      as: 'passport'
    }],
  })
  .then((user) => {
    return res.status(200).json(user)
  })
  .catch((error) => {
    console.log("ERROR: ", error);
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
      model: Passport,
      as: 'passport'
    }],
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

      return user.update({
          ...user, //spread out existing user
          ...req.body //spread out body - the differences in the body will over ride the user returned from DB.
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
      return user.destroy()
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

Update your `./controllers/passport-controller.js` to look like:

```javascript
const { Passport, User } = require('../models/')

function index(req,res) {
  Passport.findAll()
  .then((passport) => {
    return res.status(200).json(passport)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Passport.create({
    country: req.body.country,
    passportNumber: req.body.passportNumber,
    issueDate: req.body.issueDate,
    expirationDate: req.body.expirationDate,
    userId: req.body.userId
  })
  .then((passport) => {
    return res.status(200).json(passport)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(404).json({ message: 'Passport Not Found' });
      }

      return res.status(200).json(passport);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(404).json({ message: 'Passport Not Found' });
      }

      passport.update({
        ...passport, //spread out existing passport
        ...req.body //spread out req.body - the differences in the body will override the passport returned from DB.
      })
      .then((updatedPassport) => {
        return res.status(200).json(updatedPassport)
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
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(400).json({ message: 'Passport Not Found' });
      }
      passport.destroy()
        .then((passport) => {
          return res.status(200).json(passport)
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
> sequelize model:create --name Passport --attributes country:string,passportNumber:integer,issueDate:date,expirationDate:date
```

Update your `./models/passport.js` to look like:

```javascript
'use strict';
module.exports = function(sequelize, DataTypes) {
  const Passport = sequelize.define('Passport', {
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passportNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    paranoid: true
  });

  Passport.associate = (models) => {
    Passport.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'passport'
    });
  };

  return Passport;
};
```

Update your `./models/user.js` to look like:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
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
    User.hasOne(models.Passport, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'passport'
    });
  };

  return User;
};
```

Update your `./migrations/<timestamp>-create-passport.js` to look like:

```javascript
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Passports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passportNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      issueDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expirationDate: {
        type: Sequelize.DATE,
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
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Passports');
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
          isEmail : true
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
Don't forget to `sequelize db:migrate`!

The reason we placed the userId as our foreign key in the Passport model was in attempt to make it optional data.  Who knows what app we are going to end up building here but I would imagine that not every User would need to have a Passport.  Since its "optional" or "sparse" data we can create that one to one relationship in order to save space and create efficiency.

Go ahead and test this on your own.
- Create a User in Postman.
- Create a Passport and pass in the userId for the User you just created.
- Now query the User and you should see the Passport property return with all of the data you gave it.

Thats it for One-To-One! See you over at [Many-To-Many](https://github.com/williampruden/sequelize-associations/tree/master/04_many-to-many) for our last tutorial on all things Sequelize!
