/**
 * Game Model
 * 
 * Defines the schema for games in the database
 */
const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for fast queries
  },
  // Grid: array of 100 elements (10x10)
  // null = empty cell, number = number placed
  grid: {
    type: [Number],
    default: () => Array(100).fill(null),
    validate: {
      validator: function(arr) {
        return arr.length === 100;
      },
      message: 'Grid must have exactly 100 cells'
    }
  },
  currentNumber: {
    type: Number,
    default: 1,
    min: 1,
    max: 101 // 101 means game completed
  },
  // Move history for implementing undo
  moves: [{
    number: Number,
    position: Number, // 0-99
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  moveCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  gameMode: {
    type: String,
    enum: ['tutorial', 'ranked'],
    default: 'tutorial',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  timeElapsed: {
    type: Number, // seconds
    default: 0
  }
}, {
  timestamps: true
});
// Composed index to find user's in-progress game quickly
gameSchema.index({ userId: 1, status: 1 });
// ===== CUSTOM METHODS =====
// Calculate time elapsed
gameSchema.methods.calculateTimeElapsed = function() {
  if (this.completedAt) {
    return Math.floor((this.completedAt - this.startedAt) / 1000);
  }
  return Math.floor((Date.now() - this.startedAt) / 1000);
};
// Verify if game is complete
gameSchema.methods.isComplete = function() {
  return this.currentNumber > 100;
};
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;