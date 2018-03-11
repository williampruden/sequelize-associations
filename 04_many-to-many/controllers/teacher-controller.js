const { Student, Teacher } = require('../models/')

function index(req,res) {
  Teacher.findAll({
    include: [{
      model: Student,
      as: 'students',
      attributes: ['id', 'firstName', 'lastName', 'gradeLevel', 'gpa'],
      through: { attributes: [] }
    }]
  })
  .then((teacher) => {
    return res.status(200).json(teacher)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Teacher.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    subject: req.body.subject,
    numberOfClasses: req.body.numberOfClasses,
  })
  .then((teacher) => {
    return res.status(200).json(teacher)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Teacher.findById(req.params.id, {
    include: [{
      model: Student,
      as: 'students',
      attributes: ['id', 'firstName', 'lastName', 'gradeLevel', 'gpa'],
      through: { attributes: [] }
    }]
  })
    .then((teacher) => {
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher Not Found' });
      }

      console.log("TEACHER INSTANCE: ", teacher);

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

      teacher.update({
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
      teacher.destroy()
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


function addStudentToTeacher(req, res) {
  Teacher.findById(req.params.teacherId)
    .then((teacher) => {
      if (!teacher) {
        return res.status(400).json({ message: 'Teacher Not Found' });
      }

      teacher.addStudent(req.params.studentId)
        .then((response) => {
          return res.status(200).json(response)
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

module.exports = { index, create, show, update, destroy, addStudentToTeacher }
