const jwt = require( 'jsonwebtoken' );
const User = require( '../models/User' );
const protect = async ( req, res, next ) => {
  let token;
  // 1. Check if token exists in headers (Bearer TOKEN)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith( 'Bearer' )
  ) {
    try {
      // Extract token from string "Bearer xxxxx"
      token = req.headers.authorization.split( ' ' )[1];
      // 2. Verify token
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      // 3. Find user in DB (without password) and attach to request
      // This makes req.user available in all subsequent controllers
      req.user = await User.findById( decoded.userId ).select( '-password' );
      if ( !req.user ) {
        return res.status( 401 ).json( { error: 'Not authorized, user not found' } );
      }
      next(); // Pass to next middleware or controller
    } catch ( error ) {
      console.error( 'Auth Middleware Error:', error.message );
      res.status( 401 ).json( { error: 'Not authorized, token failed' } );
    }
  }
  if ( !token ) {
    res.status( 401 ).json( { error: 'Not authorized, no token' } );
  }
};

const optionalAuth = async ( req, res, next ) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith( 'Bearer' )
  ) {
    try {
      token = req.headers.authorization.split( ' ' )[1];
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      req.user = await User.findById( decoded.userId ).select( '-password' );
    } catch ( error ) {
      // Se il token è scaduto o invalido, trattiamo come ospite
      // console.warn('Optional Auth token failed:', error.message);
    }
  }
  next();
};

module.exports = { protect, optionalAuth };