const { Student, Teacher } = require('../models/')

function index(req,res) {
  Teacher.findAll()
  .then((teacher) => {
    return res.status(200).json(teacher)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Teacher.create({
    title: req.body.title,
    complete: false,
    teacherId: req.body.teacherId
  })
  .then((teacher) => {
    return res.status(200).json(teacher)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Teacher.findById(req.params.id)
    .then((teacher) => {
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher Not Found' });
      }

      return res.status(200).json(teacher);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Teacher.findById(req.params.id)
    .then((teacher) => {
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher Not Found' });
      }

      return teacher.update({
          ...teacher, //spread out existing teacher
          ...req.body //spread out body - the differences in the body will over ride the teacher returned from DB.
        })
        .then((updatedTeacher) => {
          return res.status(200).json(updatedTeacher)
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
  Teacher.findById(req.params.id)
    .then((teacher) => {
      if (!teacher) {
        return res.status(400).json({ message: 'Teacher Not Found' });
      }
      return teacher.destroy()
        .then((teacher) => {
          return res.status(200).json(teacher)
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
