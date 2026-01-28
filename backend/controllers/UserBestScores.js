const Game = require( '../models/Game' );
const mongoose = require( 'mongoose' );

exports.getUserBestScores = async ( req, res ) => {
  try {
    // FIX: Explicitly convert to ObjectId for aggregation
    const targetUserId = new mongoose.Types.ObjectId( req.user._id );
    console.log( "Searching best scores for user (ObjectId):", targetUserId );

    const userBest = await Game.aggregate( [
      // 1. Filter only 'completed' RANKED games for ALL users
      { $match: { status: 'completed', gameMode: 'ranked' } },

      // 2. Calculate duration for all
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

      // 3. CALCULATE GLOBAL RANK
      // Since MongoDB $rank requires a single sort field in some configurations,
      // we create a combined score: (points * 1 billion) - duration_ms.
      // Higher is better position.
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

      // 4. Now filter for target user
      { $match: { userId: targetUserId } },

      // 5. Sort user RESULTS (their best)
      { $sort: { currentNumber: -1, duration: 1 } },

      // 6. Limit to 10 (user's top 10 with their global rank)
      { $limit: 10 },

      // 7. Join with User to get username
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "player"
        }
      },

      // 8. Appiattisci
      { $unwind: "$player" },

      // 9. Seleziona campi finali
      {
        $project: {
          _id: 1,
          globalRank: 1, // Return rank calculated in step 3
          username: "$player.username",
          avatar: "$player.avatar",
          duration: 1,
          createdAt: 1,
          completedAt: 1,
          updatedAt: 1,
          currentNumber: { $subtract: ["$currentNumber", 1] }
        }
      }
    ] );

    res.json( userBest );
  } catch ( error ) {
    console.error( "UserBestScores error:", error );
    res.status( 500 ).json( { error: "Server error" } );
  }
};