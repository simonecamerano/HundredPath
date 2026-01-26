const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UsersController = require('../controllers/Users');
router.get('/', protect, UsersController.getAllUsers);
module.exports = router;