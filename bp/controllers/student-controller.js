const { Student, Teacher } = require('../models/')

function index(req,res) {
  Student.findAll()
  .then((student) => {
    res.status(200).json(student)
  })
  .catch((error) => {
    console.log("STUDENT INDEX ERROR ", error);
    res.status(400).json(error)
  });
}

function create(req,res) {
  console.log('STUDENT CREATE req-body: ', req.body);

  Student.create({
    title: "New Student",
    description: "once upon a student"
  })
  .then((student) => {
    res.status(200).json(student)
  })
  .catch((error) => {
    console.log("CREATE ERROR ", error);
    res.status(400).json(error)
  });
}

function show(req,res) {
  return Student.findById(req.params.id)
    .then((student) => {
      if (!student) {
        return res.status(400).json({
          message: 'Student Not Found',
        });
      }
      return res.status(200).json(student)
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function update(req,res) {

}

function destroy(req,res) {
  return Student.findById(req.params.id)
    .then(student => {
      if (!student) {
        return res.status(400).json({
          message: 'Student Not Found',
        });
      }
      return student
        .destroy()
        .then((response) => {
          console.log("DELETE STUDENT: ", response);
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
