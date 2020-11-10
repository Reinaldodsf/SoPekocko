
const passwordSchema = require('../models/password');

//Checks if the password inserted by the user has a valid format
module.exports = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		return res.status(400).json( { message: 'Password invalid!\n Minimum length 8,\n Maximum length 100,\n Must have uppercase letters,\n Must have lowercase letters,\n Must have at least 2 digits,\n Should not have spaces'})
	} else {
		next();
	}
};
