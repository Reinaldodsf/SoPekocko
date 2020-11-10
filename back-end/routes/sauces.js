const express = require('express');
const router = express.Router();

//Link to Middleware js files
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
//Link to Controller js files
const saucesCtrl = require('../controllers/sauces');

//Routes available and the endpoints 
router.get('/', auth, saucesCtrl.getAllSauces); //get all sauces for the homepage
router.post('/', auth, multer, saucesCtrl.createSauce); //add a new sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;