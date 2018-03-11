var express = require('express');
var router = express.Router();

const projectController = require('../controllers/project-controller')

// http://localhost:3000/projects
router.get('/', projectController.index);
router.post('/', projectController.create);
router.get('/:id', projectController.show);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.destroy);

module.exports = router;
