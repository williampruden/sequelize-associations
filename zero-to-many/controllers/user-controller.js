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
    bio: req.body.bio,
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
