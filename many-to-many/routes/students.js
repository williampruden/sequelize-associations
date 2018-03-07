var express = require('express');
var router = express.Router();

const studentController = require('../controllers/student-controller')

// http://localhost:3000/students
router.get('/', studentController.index);
router.post('/', studentController.create);
router.get('/:id', studentController.show);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.destroy);
router.post('/:studentId/teacher/:teacherId', studentController.addTeacherToStudent);

module.exports = router;
