const express = require( 'express' );
const router = express.Router();

// Import user controller
const userController = require( '../controllers/User' );
const { protect } = require('../middleware/auth');

// Routes
router.post( '/register', userController.registerUser );
router.post( '/login', userController.loginUser );  
router.get('/profile/:id', protect, userController.getUserProfile);
router.put('/profile/:id', protect, userController.updateUser);
router.delete('/profile/:id', protect, userController.deleteUser);

// Public route - view user profile by username
router.get('/user/:username', userController.getPublicProfile);

module.exports = router;