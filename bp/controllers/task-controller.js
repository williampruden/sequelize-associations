const { User, Task, Project } = require('../models/')

function index(req,res) {
  Task.findAll()
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

  Task.create({
    title: "Second task",
    complete: false,
    userId: 1
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
