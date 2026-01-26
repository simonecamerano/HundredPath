const express = require( 'express' );
const router = express.Router();
const { protect } = require( '../middleware/auth' );
const ProfileController = require( '../controllers/Profile' );

router.get( '/', protect, ProfileController.getMyProfile );
router.put( '/avatar', protect, ProfileController.updateAvatar );

module.exports = router;
