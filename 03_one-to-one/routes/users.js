var express = require('express');
var router = express.Router();

const userController = require('../controllers/user-controller')

// http://localhost:3000/users
router.get('/', userController.index);
router.post('/', userController.create);
router.get('/:id', userController.show);
router.put('/:id', userController.update);
router.delete('/:id', userController.destroy);

module.exports = router;
