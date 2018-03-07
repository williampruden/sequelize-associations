const { Student, Teacher } = require('../models/')

function index(req,res) {
  Student.findAll({
    include: [Teacher],
  })
  .then((student) => {
    return res.status(200).json(student)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gradeLevel: req.body.gradeLevel,
    gpa: req.body.gpa
  })
  .then((student) => {
    return res.status(200).json(student)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Student.findById(req.params.id, {
      include: [{
        model: Teacher,
        as: 'teachers'
      }]
    })
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'Student Not Found' });
      }

      return res.status(200).json(student);
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function update(req,res) {
  Student.findById(req.params.id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'Student Not Found' });
      }

      student.update({
        ...student, //spread out existing student
        ...req.body //spread out req.body - the differences in the body will override the student returned from DB.
      })
      .then((student) => {
        res.status(200).json(student)
      })
      .catch((error) => {
        res.status(400).json(error)
      });
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function destroy(req,res) {
  Student.findById(req.params.id)
    .then((student) => {
      if (!student) {
        return res.status(400).json({ message: 'Student Not Found' });
      }
      student.destroy()
      .then((student) => {
        res.status(200).json(student)
      })
      .catch((error) => {
        res.status(400).json(error)
      });
    })
    .catch((error) => {
      res.status(400).json(error)
    });
}

function addTeacherToStudent(req, res) {
  Student.findById(req.params.studentId)
    .then((student) => {
      if (!student) {
        return res.status(400).json({ message: 'Student Not Found' });
      }

      student.addTeacher(req.params.teacherId)
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


module.exports = { index, create, show, update, destroy, addTeacherToStudent }
