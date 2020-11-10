//npm install --save mongoose-unique-validator

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Sauce Schema creation
//unique: true and plugin(uniquevalidator) ensure that two users cannot share the same email
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//export the schema as a Mongoose model
module.exports = mongoose.model('User', userSchema);