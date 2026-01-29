const Game = require( '../models/Game' );
const mongoose = require( 'mongoose' );

exports.getLeaderboard = async ( req, res ) => {
  try {
    // Optional user management
    let userId = null;
    if ( req.user && req.user._id ) {
      userId = new mongoose.Types.ObjectId( req.user._id );
    }

    // Filtro temporale basato su query param
    const period = req.query.period || 'all'; // all, week, day

    // Permetti filtro per gameMode (default: ranked)
    const mode = req.query.gameMode === 'mastermind' ? 'mastermind' : 'ranked';
    let timeFilter = { status: 'completed', gameMode: mode };

    const now = new Date();
    if ( period === 'week' ) {
      const weekAgo = new Date( now.getTime() - 7 * 24 * 60 * 60 * 1000 );
      timeFilter.completedAt = { $gte: weekAgo };
    } else if ( period === 'day' ) {
      const dayAgo = new Date( now.getTime() - 24 * 60 * 60 * 1000 );
      timeFilter.completedAt = { $gte: dayAgo };
    }

    // Costruiamo le FACET dinamicamente
    const facets = {
      top10: [
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "player"
          }
        },
        { $unwind: "$player" },
        {
          $project: {
            _id: 1,
            globalRank: 1,
            avatar: "$player.avatar",
            username: "$player.username",
            duration: 1,
            completedAt: 1,
            updatedAt: 1,
            currentNumber: { $subtract: ["$currentNumber", 1] },
            bonusPoints: 1
          }
        }
      ]
    };

    // Add 'userBest' facet ONLY if there's a logged user
    if ( userId ) {
      facets.userBest = [
        { $match: { userId: userId } },
        { $sort: { globalRank: 1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "player"
          }
        },
        { $unwind: "$player" },
        {
          $project: {
            _id: 1,
            globalRank: 1,
            avatar: "$player.avatar",
            username: "$player.username",
            duration: 1,
            completedAt: 1,
            updatedAt: 1,
            currentNumber: { $subtract: ["$currentNumber", 1] },
            bonusPoints: 1
          }
        }
      ];
    }

    const results = await Game.aggregate( [
      // 1. Filtra per status e periodo temporale
      { $match: timeFilter },

      // 2. Calcola durata
      {
        $addFields: {
          endTime: { $ifNull: ["$completedAt", "$updatedAt"] },
        }
      },
      {
        $addFields: {
          duration: { $subtract: ["$endTime", "$startedAt"] }
        }
      },

      // 3. CALCOLA IL RANK GLOBALE (in mastermind somma bonusPoints)
      {
        $addFields: {
          totalScore: {
            $cond: [
              { $eq: [mode, "mastermind"] },
              { $add: [ { $subtract: ["$currentNumber", 1] }, { $ifNull: ["$bonusPoints", 0] } ] },
              { $subtract: ["$currentNumber", 1] }
            ]
          }
        }
      },
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ["$totalScore", 1000000000] },
              { $ifNull: ["$duration", 0] }
            ]
          }
        }
      },
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { combinedRankScore: -1 },
          output: {
            globalRank: {
              $rank: {}
            }
          }
        }
      },

      // 4. Eseguiamo le facet costruite dinamicamente
      {
        $facet: facets
      }
    ] );

    const finalResult = {
      top10: results[0].top10,
      userBest: userId && results[0].userBest ? results[0].userBest[0] || null : null
    };

    res.json( finalResult );
  } catch ( error ) {
    console.error( "Leaderboard error:", error );
    res.status( 500 ).json( { error: "Server error" } );
  }
};