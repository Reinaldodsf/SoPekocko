const express = require('express');
const router = express.Router();

//Link to Middleware js files
const passwordValidation = require('../middleware/passwordFormatValidation');
//Link Controllers
const userCtrl = require('../controllers/user');

//Routes available and the endpoints
router.post('/signup',passwordValidation, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;