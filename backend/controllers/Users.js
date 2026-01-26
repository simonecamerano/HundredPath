const User = require( '../models/User' );
const Game = require( '../models/Game' );

exports.getAllUsers = async ( req, res ) => {
  try {
    // Step 1: Calcola globalRank per TUTTE le partite RANKED completate
    const rankedGames = await Game.aggregate( [
      { $match: { status: 'completed', gameMode: 'ranked' } }, // SOLO RANKED
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
        $project: {
          userId: 1,
          currentNumber: 1,
          globalRank: 1
        }
      }
    ] );

    // Step 2: Raggruppa per utente e calcola le statistiche (SOLO RANKED)
    const usersWithStats = await User.aggregate( [
      {
        $lookup: {
          from: 'games',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] },
                gameMode: 'ranked' // SOLO RANKED
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

    // Step 3: Aggiungi bestRank a ogni utente dai rankedGames
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

    // Ordina per bestRank (migliore = più in alto)
    // Chi non ha rank va alla fine
    finalUsers.sort( ( a, b ) => {
      if ( a.bestRank === null ) return 1;
      if ( b.bestRank === null ) return -1;
      return a.bestRank - b.bestRank;
    } );

    res.json( finalUsers );
  } catch ( error ) {
    console.error( 'Error loading users:', error );
    res.status( 500 ).json( { error: 'Errore caricamento utenti' } );
  }
};