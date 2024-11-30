const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>" format

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
    req.user = decoded; // Attach decoded user data to the request
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};
