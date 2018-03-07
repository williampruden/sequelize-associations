var express = require('express');
var router = express.Router();

const teacherController = require('../controllers/teacher-controller')

// http://localhost:3000/teachers
router.get('/', teacherController.index);
router.post('/', teacherController.create);
router.get('/:id', teacherController.show);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.destroy);
router.post('/:teacherId/student/:studentId', teacherController.addStudentToTeacher);

module.exports = router;
