const Game = require( '../models/Game' );
const mongoose = require( 'mongoose' );

exports.getLeaderboard = async ( req, res ) => {
  try {
    const userId = new mongoose.Types.ObjectId( req.user._id );

    const results = await Game.aggregate( [
      // 1. Filtra solo 'completed' per tutti
      { $match: { status: 'completed' } },

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

      // 3. CALCOLA IL RANK GLOBALE (coerente con UserBestScores)
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ["$currentNumber", 1000000000] },
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

      // 4. Utilizziamo FACET per separare Top 10 e Record Utente
      {
        $facet: {
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
                currentNumber: { $subtract: ["$currentNumber", 1] }
              }
            }
          ],
          userBest: [
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
                currentNumber: { $subtract: ["$currentNumber", 1] }
              }
            }
          ]
        }
      }
    ] );

    const finalResult = {
      top10: results[0].top10,
      userBest: results[0].userBest[0] || null
    };

    res.json( finalResult );
  } catch ( error ) {
    console.error( "Leaderboard error:", error );
    res.status( 500 ).json( { error: "Server error" } );
  }
};