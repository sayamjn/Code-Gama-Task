const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const authenticateToken = require('../middleware/auth');

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;