const { User, Task, Project } = require('../models/')

function index(req,res) {
  Project.findAll({
    include: [{
      model: User,
      as: "users",
      include: [{
        model: Task,
        as: "tasks"
      }]
    }],
  })
  .then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    console.log("PROJECT INDEX ERROR ", error);
    res.status(400).json(error)
  });
}

function create(req,res) {
  console.log('PROJECT CREATE req-body: ', req.body);

  Project.create({
    title: "New Project",
    description: "once upon a project"
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
  return Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(400).json({
          message: 'Project Not Found',
        });
      }
      return res.status(200).json(project)
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function update(req,res) {

}

function destroy(req,res) {
  return Project.findById(req.params.id)
    .then(project => {
      if (!project) {
        return res.status(400).json({
          message: 'Project Not Found',
        });
      }
      return project
        .destroy()
        .then((response) => {
          console.log("DELETE PROJECT: ", response);
          res.status(204).json()
        })
        .catch((error) => {
          res.status(400).json(error)
        });
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

module.exports = { index, create, show, update, destroy }
