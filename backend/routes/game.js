const express = require( 'express' );
const router = express.Router();
const { protect } = require( '../middleware/auth' );

// Import game controller
const gameController = require( '../controllers/Game' );
const LeaderboardController = require( '../controllers/Leaderboard' );
const UserBestScoresController = require( '../controllers/UserBestScores' );

// Routes
router.post( '/start', protect, gameController.startGame );
router.post( '/move', protect, gameController.makeMove );
router.post( '/undo', protect, gameController.undoMove );
router.post( '/over', protect, gameController.gameOver ); // Aggiunto
router.get( '/leaderboard', protect, LeaderboardController.getLeaderboard );
router.get( '/userBestScores', protect, UserBestScoresController.getUserBestScores );
module.exports = router;