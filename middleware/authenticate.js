/**
 * Middleware function to check if a user is authenticated.
 * 
 * - It verifies that there is an active user session.
 * - If no user is found in the session (req.session.user is undefined),
 *   the request is blocked with a 401 Unauthorized response.
 * - If the user is authenticated, the request continues to the next middleware or route handler.
 */
export const isAuthenticated = (req, res, next) => {
    // Check if a user session exists
    if (!req.session?.user) {
        // If not authenticated, respond with a 401 Unauthorized status
        return res.status(401).json('You do not have any authorization to access this resource');
    }
    // If authenticated, allow the request to proceed
    next();
};
/**
 * ===========================================
 * AUTHENTICATION MIDDLEWARE
 * ===========================================
 * Supports both:
 *  - Session-based authentication (req.session.user)
 *  - JWT-based authentication via Authorization header
 * 
 * How it works:
 * 1. Checks if user is logged in through session.
 * 2. If no session, checks for a valid JWT token.
 * 3. If neither is valid, returns 401 Unauthorized.
 */

// import jwt from 'jsonwebtoken';

// /**
//  * Middleware function to authenticate requests
//  * using either session or JWT-based authentication.
//  */
// export const isAuthenticated = (req, res, next) => {
//   try {
//     // --- Option 1: Check for session-based authentication
//     if (req.session?.user) {
//       return next(); // Session found, continue
//     }

//     // --- Option 2: Check for JWT-based authentication
//     const authHeader = req.headers.authorization;

//     // If no Authorization header, block access
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res
//         .status(401)
//         .json('You do not have any authorization to access this resource');
//     }

//     // Extract token
//     const token = authHeader.split(' ')[1];

//     // Verify JWT token using secret key
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user info from token to the request (optional)
//     req.user = decoded;

//     // Continue to the next middleware or controller
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error.message);
//     return res.status(401).json('Invalid or expired token');
//   }
// };

