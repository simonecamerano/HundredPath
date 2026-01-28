const User = require( '../models/User' );
const jwt = require( 'jsonwebtoken' );
// Register new user
exports.registerUser = async ( req, res ) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne( {
      $or: [{ email }, { username }]
    } );

    if ( existingUser ) {
      return res.status( 409 ).json( {
        error: 'Username or email already exists'
      } );
    }

    // Create user
    const user = await User.create( {
      username,
      email,
      password,
      avatar: req.body.avatar // Aggiunto!
    } );
    await user.save();

    res.status( 201 ).json( {
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    } );
  } catch ( error ) {
    console.error( 'Error registering user:', error );
    res.status( 500 ).json( { error: 'Failed to register user' } );
  }
};
// Login user
exports.loginUser = async ( req, res ) => {
  try {
    const { email, password } = req.body;  // Better email than username

    const user = await User.findOne( { email } ).select( '+password' );

    if ( !user ) {
      return res.status( 401 ).json( { error: 'Invalid credentials' } );
    }

    const isMatch = await user.comparePassword( password );

    if ( !isMatch ) {
      return res.status( 401 ).json( { error: 'Invalid credentials' } );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json( {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        tutorialCompleted: user.tutorialCompleted || false
      }
    } );
  } catch ( error ) {
    console.error( 'Error logging in user:', error );
    res.status( 500 ).json( { error: 'Failed to log in user' } );
  }
};
// Update user (protected route - richiede autenticazione)
exports.updateUser = async ( req, res ) => {
  try {
    const { id } = req.params;  // Da URL: /api/users/:id
    const { username, email, password, avatar } = req.body;

    const user = await User.findById( id );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    // Security check: Only the owner can update the profile
    if ( req.user._id.toString() !== id ) {
      return res.status( 403 ).json( { error: 'Unauthorized to update this profile' } );
    }

    // Update only provided fields
    if ( username ) user.username = username;
    if ( email ) user.email = email;
    if ( password ) user.password = password;
    if ( avatar ) user.avatar = avatar;

    await user.save();

    res.json( {
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    } );
  } catch ( error ) {
    console.error( 'Error updating user:', error );
    res.status( 500 ).json( { error: 'Failed to update user' } );
  }
};
// Delete user (protected route)
exports.deleteUser = async ( req, res ) => {
  try {
    const { id } = req.params;

    // Security check: Only the owner can delete the profile
    if ( req.user._id.toString() !== id ) {
      return res.status( 403 ).json( { error: 'Unauthorized to delete this profile' } );
    }

    // 1. Delete all user's games FIRST
    const Game = require( '../models/Game' );
    await Game.deleteMany( { userId: id } );
    console.log( `🗑️ Deleted all games for user ${id}` );

    // 2. Delete the user
    const user = await User.findByIdAndDelete( id );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    res.json( { message: 'User deleted successfully' } );
  } catch ( error ) {
    console.error( 'Error deleting user:', error );
    res.status( 500 ).json( { error: 'Failed to delete user' } );
  }
};
// Get user profile (protected route)
exports.getUserProfile = async ( req, res ) => {
  try {
    const { id } = req.params;

    const user = await User.findById( id );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    res.json( { user } );
  } catch ( error ) {
    console.error( 'Error getting user:', error );
    res.status( 500 ).json( { error: 'Failed to get user' } );
  }
};

// Get public user profile by username (NO AUTH REQUIRED)
exports.getPublicProfile = async ( req, res ) => {
  try {
    const { username } = req.params;
    const Game = require( '../models/Game' );

    // Find user by username (case insensitive)
    const user = await User.findOne( { 
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    } );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    // Get user's stats
    const totalGames = await Game.countDocuments( { userId: user._id, isCompleted: true } );
    const wins = await Game.countDocuments( { userId: user._id, isCompleted: true, gameMode: 'ranked' } );
    
    // Get recent games (last 5)
    const recentGames = await Game.find( { userId: user._id, isCompleted: true } )
      .sort( { createdAt: -1 } )
      .limit( 5 )
      .select( 'gameMode duration currentNumber createdAt' );

    // Calculate average duration
    const completedGames = await Game.find( { userId: user._id, isCompleted: true, duration: { $exists: true } } );
    const avgDuration = completedGames.length > 0
      ? Math.round( completedGames.reduce( ( sum, game ) => sum + game.duration, 0 ) / completedGames.length )
      : null;

    // Get best rank from leaderboard
    const Leaderboard = require( '../models/Leaderboard' );
    const bestScore = await Leaderboard.findOne( { userId: user._id } ).sort( { rank: 1 } );

    res.json( {
      profile: {
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
        stats: {
          totalGames,
          wins,
          avgDuration,
          bestRank: bestScore ? bestScore.rank : null
        }
      },
      recentGames
    } );
  } catch ( error ) {
    console.error( 'Error getting public profile:', error );
    res.status( 500 ).json( { error: 'Failed to get profile' } );
  }
};