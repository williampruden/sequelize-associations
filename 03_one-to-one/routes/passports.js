var express = require('express');
var router = express.Router();

const passportController = require('../controllers/passport-controller')

// http://localhost:3000/passports
router.get('/', passportController.index);
router.post('/', passportController.create);
router.get('/:id', passportController.show);
router.put('/:id', passportController.update);
router.delete('/:id', passportController.destroy);

module.exports = router;
