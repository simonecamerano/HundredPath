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

    // Track last access: the retention policy in the privacy policy is measured on this.
    // Written without validation and without blocking the response.
    await User.updateOne( { _id: user._id }, { $set: { lastLogin: new Date() } } );

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
// Get user profile (protected route)
exports.getUserProfile = async ( req, res ) => {
  try {
    const { id } = req.user;
    const gameMode = req.query.gameMode || 'ranked'; // Default to ranked
    const Game = require( '../models/Game' );

    const user = await User.findById( id );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    // Reuse logic from getPublicProfile but for current user
    // Get user's stats - Filter by gameMode
    const totalGames = await Game.countDocuments( {
      userId: id,
      gameMode: gameMode
    } );

    const wins = await Game.countDocuments( {
      userId: id,
      currentNumber: 101,
      gameMode: gameMode
    } );

    const completedGames = await Game.find( {
      userId: id,
      status: 'completed',
      gameMode: gameMode,
      duration: { $exists: true }
    } );

    const avgDuration = completedGames.length > 0
      ? Math.round( completedGames.reduce( ( sum, game ) => sum + game.duration, 0 ) / completedGames.length )
      : null;

    // Get best rank
    const rankedGames = await Game.aggregate( [
      {
        $match: {
          userId: user._id,
          status: 'completed',
          gameMode: gameMode
        }
      },
      {
        $addFields: {
          endTime: { $ifNull: ['$completedAt', '$updatedAt'] }
        }
      },
      {
        $addFields: {
          duration: { $subtract: ['$endTime', '$startedAt'] },
          totalScore: {
            $cond: {
              if: { $eq: [gameMode, 'mastermind'] },
              then: { $add: ['$currentNumber', { $ifNull: ['$bonusPoints', 0] }] },
              else: '$currentNumber'
            }
          }
        }
      },
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ['$totalScore', 1000000000] },
              { $ifNull: ['$duration', 0] }
            ]
          }
        }
      },
      {
        $sort: { combinedRankScore: -1 }
      },
      { $limit: 1 }
    ] );

    let bestRank = null;
    if ( rankedGames.length > 0 ) {
      const bestGame = rankedGames[0];
      const betterGamesCount = await Game.aggregate( [
        {
          $match: {
            status: 'completed',
            gameMode: gameMode
          }
        },
        {
          $addFields: {
            endTime: { $ifNull: ['$completedAt', '$updatedAt'] }
          }
        },
        {
          $addFields: {
            duration: { $subtract: ['$endTime', '$startedAt'] },
            totalScore: {
              $cond: {
                if: { $eq: [gameMode, 'mastermind'] },
                then: { $add: ['$currentNumber', { $ifNull: ['$bonusPoints', 0] }] },
                else: '$currentNumber'
              }
            }
          }
        },
        {
          $addFields: {
            combinedRankScore: {
              $subtract: [
                { $multiply: ['$totalScore', 1000000000] },
                { $ifNull: ['$duration', 0] }
              ]
            }
          }
        },
        {
          $match: {
            combinedRankScore: { $gt: bestGame.combinedRankScore }
          }
        },
        {
          $count: "betterCount"
        }
      ] );
      bestRank = ( betterGamesCount.length > 0 ? betterGamesCount[0].betterCount : 0 ) + 1;
    }

    // Construct response similar to User model but with dynamic stats
    const userResponse = user.toJSON();
    userResponse.stats = {
      totalGames,
      wins,
      avgDuration,
      bestRank
    };

    res.json( { user: userResponse } );
  } catch ( error ) {
    console.error( 'Error getting user:', error );
    res.status( 500 ).json( { error: 'Failed to get user' } );
  }
};

// Get public user profile by username (NO AUTH REQUIRED)
exports.getPublicProfile = async ( req, res ) => {
  try {
    const { username } = req.params;
    const gameMode = req.query.gameMode || 'ranked'; // Default to ranked
    const Game = require( '../models/Game' );

    // Find user by username (case insensitive)
    const user = await User.findOne( {
      username: { $regex: new RegExp( `^${username}$`, 'i' ) }
    } );

    if ( !user ) {
      return res.status( 404 ).json( { error: 'User not found' } );
    }

    // Get user's stats - Filter by gameMode
    const totalGames = await Game.countDocuments( {
      userId: user._id,
      gameMode: gameMode
    } );

    const wins = await Game.countDocuments( {
      userId: user._id,
      currentNumber: 101,
      gameMode: gameMode
    } );

    // Get recent games (last 5 - specific mode) with calculated duration
    const recentGames = await Game.aggregate( [
      {
        $match: {
          userId: user._id,
          status: 'completed',
          gameMode: gameMode
        }
      },
      {
        $addFields: {
          endTime: { $ifNull: ['$completedAt', '$updatedAt'] }
        }
      },
      {
        $addFields: {
          duration: { $subtract: ['$endTime', '$startedAt'] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          gameMode: 1,
          duration: 1,
          currentNumber: 1,
          bonusPoints: 1,
          createdAt: 1
        }
      }
    ] );

    // Calculate average duration (specific mode only)
    const completedGames = await Game.find( {
      userId: user._id,
      status: 'completed',
      gameMode: gameMode,
      duration: { $exists: true }
    } );

    const avgDuration = completedGames.length > 0
      ? Math.round( completedGames.reduce( ( sum, game ) => sum + game.duration, 0 ) / completedGames.length )
      : null;

    // Get best rank from all games of this mode via aggregation
    const rankedGames = await Game.aggregate( [
      {
        $match: {
          userId: user._id,
          status: 'completed',
          gameMode: gameMode
        }
      },
      {
        $addFields: {
          endTime: { $ifNull: ['$completedAt', '$updatedAt'] }
        }
      },
      {
        $addFields: {
          duration: { $subtract: ['$endTime', '$startedAt'] },
          totalScore: {
            $cond: {
              if: { $eq: [gameMode, 'mastermind'] },
              then: { $add: ['$currentNumber', { $ifNull: ['$bonusPoints', 0] }] },
              else: '$currentNumber'
            }
          }
        }
      },
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ['$totalScore', 1000000000] },
              { $ifNull: ['$duration', 0] }
            ]
          }
        }
      },
      {
        $sort: { combinedRankScore: -1 }
      },
      { $limit: 1 }
    ] );

    // Calculate global rank for best game
    let bestRank = null;
    if ( rankedGames.length > 0 ) {
      const bestGame = rankedGames[0];

      // We need to count how many games (globally) have a better score
      // Better score = Higher combinedRankScore

      // Re-calculate combinedRankScore logic for query
      // Since we can't easily do calculated fields in simple find/count, we use aggregation for global comparison too

      // Optimization: For Ranked/Mastermind, the logic is consistent.
      // We can use an aggregation to count better games.

      const betterGamesCount = await Game.aggregate( [
        {
          $match: {
            status: 'completed',
            gameMode: gameMode
          }
        },
        {
          $addFields: {
            endTime: { $ifNull: ['$completedAt', '$updatedAt'] }
          }
        },
        {
          $addFields: {
            duration: { $subtract: ['$endTime', '$startedAt'] },
            totalScore: {
              $cond: {
                if: { $eq: [gameMode, 'mastermind'] },
                then: { $add: ['$currentNumber', { $ifNull: ['$bonusPoints', 0] }] },
                else: '$currentNumber'
              }
            }
          }
        },
        {
          $addFields: {
            combinedRankScore: {
              $subtract: [
                { $multiply: ['$totalScore', 1000000000] },
                { $ifNull: ['$duration', 0] }
              ]
            }
          }
        },
        {
          $match: {
            combinedRankScore: { $gt: bestGame.combinedRankScore }
          }
        },
        {
          $count: "betterCount"
        }
      ] );

      bestRank = ( betterGamesCount.length > 0 ? betterGamesCount[0].betterCount : 0 ) + 1;
    }

    res.json( {
      profile: {
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
        stats: {
          totalGames,
          wins,
          avgDuration,
          bestRank
        }
      },
      recentGames
    } );
  } catch ( error ) {
    console.error( 'Error getting public profile:', error );
    res.status( 500 ).json( { error: 'Failed to get profile' } );
  }
};