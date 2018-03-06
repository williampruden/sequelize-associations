const { Student, Teacher } = require('../models/')

function index(req,res) {
  Teacher.findAll()
  .then((teacher) => {
    res.status(200).json(teacher)
  })
  .catch((error) => {
    console.log("TEACHER INDEX ERROR ", error);
    res.status(400).json(error)
  });
}

function create(req,res) {
  console.log('TEACHER CREATE req-body: ', req.body);

  Teacher.create({
    title: "New Teacher",
    description: "once upon a teacher"
  })
  .then((teacher) => {
    res.status(200).json(teacher)
  })
  .catch((error) => {
    console.log("CREATE ERROR ", error);
    res.status(400).json(error)
  });
}

function show(req,res) {
  return Teacher.findById(req.params.id)
    .then((teacher) => {
      if (!teacher) {
        return res.status(400).json({
          message: 'Teacher Not Found',
        });
      }
      return res.status(200).json(teacher)
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function update(req,res) {

}

function destroy(req,res) {
  return Teacher.findById(req.params.id)
    .then(teacher => {
      if (!teacher) {
        return res.status(400).json({
          message: 'Teacher Not Found',
        });
      }
      return teacher
        .destroy()
        .then((response) => {
          console.log("DELETE TEACHER: ", response);
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
