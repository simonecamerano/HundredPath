const User = require( '../models/User' );
const Game = require( '../models/Game' );

exports.getAllUsers = async ( req, res ) => {
  try {
    const gameMode = req.query.gameMode || 'ranked'; // Default to ranked

    // Step 1: Calculate globalRank for ALL completed games of specific mode
    const rankedGames = await Game.aggregate( [
      { $match: { status: 'completed', gameMode: gameMode } },
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
        $setWindowFields: {
          partitionBy: null,
          sortBy: { combinedRankScore: -1 },
          output: {
            globalRank: { $rank: {} }
          }
        }
      },
      {
        $project: {
          userId: 1,
          currentNumber: 1,
          bonusPoints: 1,
          globalRank: 1
        }
      }
    ] );

    // Step 2: Group by user and calculate stats for specific mode
    const usersWithStats = await User.aggregate( [
      {
        $lookup: {
          from: 'games',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] },
                gameMode: gameMode
              }
            }
          ],
          as: 'games'
        }
      },
      {
        $addFields: {
          totalGames: { $size: '$games' },
          wins: {
            $size: {
              $filter: {
                input: '$games',
                as: 'game',
                cond: { $eq: ['$$game.currentNumber', 101] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          winRate: {
            $cond: [
              { $gt: ['$totalGames', 0] },
              { $round: [{ $multiply: [{ $divide: ['$wins', '$totalGames'] }, 100] }, 1] },
              0
            ]
          }
        }
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          createdAt: 1,
          totalGames: 1,
          wins: 1,
          winRate: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ] );

    // Step 3: Add bestRank to each user from rankedGames
    const finalUsers = usersWithStats.map( user => {
      const userRankedGames = rankedGames.filter(
        game => game.userId.toString() === user._id.toString()
      );

      const bestRank = userRankedGames.length > 0
        ? Math.min( ...userRankedGames.map( g => g.globalRank ) )
        : null;

      return {
        ...user,
        bestRank
      };
    } );

    // Sort by bestRank (better = higher)
    // Users without rank go to the end
    finalUsers.sort( ( a, b ) => {
      if ( a.bestRank === null ) return 1;
      if ( b.bestRank === null ) return -1;
      return a.bestRank - b.bestRank;
    } );

    res.json( finalUsers );
  } catch ( error ) {
    console.error( 'Error loading users:', error );
    res.status( 500 ).json( { error: 'Error loading users' } );
  }
};