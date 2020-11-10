const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //extract the token from the incoming request Authorization header
        const token = req.headers.authorization.split(' ')[1];
        //verify function to decode our token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //for production, replaced with a much longer random string
        //extract the user ID from the token
        const userId = decodedToken.userId;
        //if the request contains a user ID, compare to the one extracted from the token 
        if (req.body.userId && req.body.userId !== userId) {
          throw 'Invalid user ID';
        } else {
          //useris authenticated
          next();
        }
    } catch {
        res.status(401).json({
          error: new Error('Invalid request!')
        });
    }
};