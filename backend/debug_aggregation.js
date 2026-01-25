
const mongoose = require( 'mongoose' );
const Game = require( './models/Game' );
const User = require( './models/User' );

const MONGO_URI = 'mongodb://localhost:27017/hundredpath';

async function testAggregation() {
  try {
    await mongoose.connect( MONGO_URI );
    console.log( 'Connected to MongoDB' );

    const user = await User.findOne();
    if ( !user ) {
      console.log( 'No user found' );
      process.exit( 1 );
    }
    const targetUserId = user._id;

    const result = await Game.aggregate( [
      { $match: { status: 'completed' } },
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
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ["$currentNumber", 1000000000] },
              "$duration"
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
      { $match: { userId: targetUserId } },
      { $sort: { currentNumber: -1, duration: 1 } },
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
          username: "$player.username",
          avatar: "$player.avatar",
          duration: 1,
          completedAt: 1,
          updatedAt: 1,
          currentNumber: { $subtract: ["$currentNumber", 1] }
        }
      }
    ] );

    console.log( 'Aggregation result length:', result.length );
    if ( result.length > 0 ) {
      console.log( 'First result:', JSON.stringify( result[0], null, 2 ) );
    } else {
      console.log( 'No games found for user:', targetUserId );
    }

    process.exit( 0 );
  } catch ( err ) {
    console.error( 'Aggregation failed:', err );
    process.exit( 1 );
  }
}

testAggregation();
