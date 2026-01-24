const express = require( 'express' );
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import game controller
const gameController = require( '../controllers/Game' );

// Routes
router.post( '/start', protect, gameController.startGame );
router.post('/move', protect, gameController.makeMove);

module.exports = router;  