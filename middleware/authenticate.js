const jwt = require("jsonwebtoken");
// const isAuthenticated = (req, res, next) => {
//     if (req.session.user === undefined) {
//         return res.status(403).json('You do not have access')
//     }
//     next()
// }
// Example of authCheck middleware (in a separate file or within your routes)

// const authCheck = (req, res, next) => {
//     // Passport adds the 'user' property to the request object for logged-in users.
//     if (!req.user) {
//         // User is not logged in, redirect them to the login page.
//         res.redirect('/login');
//     } else {
//         // User is logged in, proceed to the next handler (the route function).
//         next();
//     }
// };
/**
 * Middleware to check if a user is authenticated (logged in).
 * If the user is logged in, it calls next() to proceed.
 * If the user is not logged in, it redirects them to the login page.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
// const isAuthenticated = (req, res, next) => {
//     // Passport attaches the user object to req.user for authenticated sessions.
//     if (req.user) {
//         // User is logged in, proceed to the next middleware or route handler (the CRUD function)
//         next();
//     } else {
//         // User is not logged in.
//         // Option 1: Redirect to the login page
//         req.flash('error', 'You must be logged in to perform this action.');
//         res.redirect('/login'); 
        
//         // OR Option 2: Send a 401 Unauthorized JSON response (better for API endpoints)
//         // return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
//     }
// }

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // invalid token
      }
      req.user = user; // attach decoded payload to request
      next();
    });
  } else {
    res.sendStatus(401); // no token provided
  }
}
const generateToken = (user) => {
  // user here is typically from your DB or OAuth provider
  const payload = {
    id: user._id,
    email: user.email,
    displayName: user.displayName, // include this for profile page
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { authenticateJWT, generateToken }