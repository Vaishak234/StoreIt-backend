import asyncHandler from 'express-async-handler';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'

/**
 * Middleware to verify the JWT token from the cookies.
 * Ensures the token is valid and attaches the decoded user information to the request object.
 */

const verifyAuthToken = asyncHandler(async (req, res, next) => {
  // Access the token from the cookies
  const token = req.cookies?.jwt; // Assuming the cookie name is 'token'

  if (!token || token.trim() === 'null') {
    return res.status(401).json({ message: 'Missing token in cookies', error: true });
  }

  // Verify the token using the secret key stored in environment variables
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
    if (error) {
      // Token verification failed (invalid or expired token)
      return res.status(401).json({ message: 'Token is invalid or expired', error: true });
    }
    // Attach the decoded user information to the request object
    req.userId = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  });
});

export default verifyAuthToken;