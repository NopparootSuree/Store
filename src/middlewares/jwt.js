const jwt = require('jsonwebtoken')

function JWTMiddleware(secretKey) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const tokenString = authHeader.split(' ')[1];
    try {
      const token = jwt.verify(tokenString, secretKey);

      if (token) {
        req.headers.authorization = authHeader;
        req.user = { username: token.username };
        next();
      } else {
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
  
module.exports = JWTMiddleware;