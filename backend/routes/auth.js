const express = require( 'express' );
const router = express.Router();

// Import user controller
const userController = require( '../controllers/User' );

// Routes
router.post( '/register', userController.registerUser );
router.post( '/login', userController.loginUser );  
router.get('/profile/:id', userController.getUserProfile);

module.exports = router;