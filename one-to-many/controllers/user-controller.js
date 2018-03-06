const { User, Task, Project } = require('../models/')
 
function index(req,res) {
  User.findAll({
    include: [{
      model: Task,
      as: 'tasks'
    }],
  })
  .then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    console.log("INDEX ERROR ", error);
    res.status(400).json(error)
  });
}

function create(req,res) {
  console.log('CREATE req-body: ', req.body);

  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    email: req.body.email,
    projectId: req.body.projectId,
  })
  .then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    console.log("CREATE ERROR ", error);
    res.status(400).json(error)
  });
}

function show(req,res) {

}

function update(req,res) {

}

function destroy(req,res) {

}

module.exports = { index, create, show, update, destroy }
