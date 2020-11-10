//npm install --save bcrypt
//npm install --save jsonwebtoken

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  //bcrypt's hash function on the password, will salt the password 10 times   
  bcrypt.hash(req.body.password, 10) 
      //then create a new user and save it to the database  
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'User added successfully!' }))
          .catch((error) => res.status(500).json({ error: error }));
      })
      .catch(error => res.status(500).json({ error: error }));
};

exports.login = (req, res, next) => {
  //check if the email entered by the user corresponds to an existing user in the database
  User.findOne({ email: req.body.email })
    .then(
      (user) => {
        if (!user) {
          return res.status(401).json({ error: error });
        }
        //bcrypt's compare function to compare the user entered password with the hash saved in the database
        bcrypt.compare(req.body.password, user.password)
          //if they match, our user has valid credentials
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: error });
            }
            //encode a new token
            const token = jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET', //for production, replaced with a much longer random string
              { expiresIn: '24h' });

            res.status(200).json({
              userId: user._id,
              token: token
            });
          })
          .catch((error) => res.status(500).json({ error: error}));
      })
      .catch((error) => res.status(500).json({error: error}));
}