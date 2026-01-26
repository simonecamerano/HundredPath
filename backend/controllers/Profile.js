const User = require( '../models/User' );
const Game = require( '../models/Game' );

// GET current user's profile with stats
exports.getMyProfile = async ( req, res ) => {
  try {
    const userId = req.user._id;

    // 1. Get user basic info
    const user = await User.findById( userId ).select( '-password' );
    if ( !user ) {
      return res.status( 404 ).json( { error: 'Utente non trovato' } );
    }

    // 2. Calculate stats (same logic as Users.js but for single user)
    const rankedGames = await Game.aggregate( [
      { $match: { status: 'completed' } },
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
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ['$currentNumber', 1000000000] },
              { $ifNull: ['$duration', 0] }
            ]
          }
        }
      },
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { combinedRankScore: -1 },
          output: {
            globalRank: { $rank: {} }
          }
        }
      },
      {
        $match: { userId: userId }
      },
      {
        $project: {
          globalRank: 1,
          currentNumber: 1,
          duration: 1
        }
      }
    ] );

    // 3. Get all user games for basic stats
    const allGames = await Game.find( { userId } );
    const totalGames = allGames.length;
    const wins = allGames.filter( g => g.currentNumber === 101 ).length;
    const bestRank = rankedGames.length > 0
      ? Math.min( ...rankedGames.map( g => g.globalRank ) )
      : null;

    // 4. Calculate average time (only for completed games)
    const completedGames = allGames.filter( g => g.status === 'completed' );
    let avgDuration = null;
    if ( completedGames.length > 0 ) {
      const totalDuration = completedGames.reduce( ( sum, game ) => {
        const endTime = game.completedAt || game.updatedAt;
        return sum + ( endTime - game.startedAt );
      }, 0 );
      avgDuration = Math.floor( totalDuration / completedGames.length );
    }

    res.json( {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      stats: {
        totalGames,
        wins,
        bestRank,
        avgDuration
      }
    } );
  } catch ( error ) {
    console.error( 'Error fetching profile:', error );
    res.status( 500 ).json( { error: 'Errore nel caricamento del profilo' } );
  }
};

// PUT update user's avatar
exports.updateAvatar = async ( req, res ) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    if ( !avatar ) {
      return res.status( 400 ).json( { error: 'Avatar richiesto' } );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).select( '-password' );

    res.json( {
      message: 'Avatar aggiornato con successo',
      user
    } );
  } catch ( error ) {
    console.error( 'Error updating avatar:', error );
    res.status( 500 ).json( { error: 'Errore nell\'aggiornamento dell\'avatar' } );
  }
};
