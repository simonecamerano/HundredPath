/**
 * Leaderboard Model
 * 
 * Defines the schema for the global leaderboard
 */
const mongoose = require('mongoose');
const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    unique: true // One entry per game
  },
  username: {
    type: String,
    required: true
    // Denormalized for performance (avoids populate on every query)
  },
  moveCount: {
    type: Number,
    required: true,
    min: 99 // Theoretical minimum: 99 moves to place numbers from 2 to 100
  },
  timeElapsed: {
    type: Number, // seconds
    required: true
  },
  completedAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});
// Composed index for leaderboard sorting
// Orders by: fewer moves (better), then less time (better)
leaderboardSchema.index({ moveCount: 1, timeElapsed: 1 });
// Index to find user entries quickly
leaderboardSchema.index({ userId: 1 });
// ===== STATIC METHODS =====
// Get top N players
leaderboardSchema.statics.getTopPlayers = async function(limit = 100) {
  return this.find()
    .sort({ moveCount: 1, timeElapsed: 1 })
    .limit(limit)
    .select('-__v');
};
// Get rank of a specific user
leaderboardSchema.statics.getUserRank = async function(userId) {
  const userEntry = await this.findOne({ userId });
  
  if (!userEntry) {
    return null;
  }
  // Count how many players have done better
  const betterCount = await this.countDocuments({
    $or: [
      { moveCount: { $lt: userEntry.moveCount } },
      { 
        moveCount: userEntry.moveCount, 
        timeElapsed: { $lt: userEntry.timeElapsed } 
      }
    ]
  });
  return {
    rank: betterCount + 1,
    entry: userEntry
  };
};
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard;