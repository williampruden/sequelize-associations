var express = require('express');
var router = express.Router();

const taskController = require('../controllers/task-controller')

// http://localhost:3000/tasks
router.get('/', taskController.index);
router.post('/', taskController.create);
router.get('/:id', taskController.show);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

module.exports = router;
