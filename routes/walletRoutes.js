const express = require('express');
const router = express.Router();
const WalletController = require('../controllers/walletController');
const authenticateToken = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);
router.use(apiLimiter);

router.get('/balance', WalletController.getBalance);
router.post('/add-funds', WalletController.addFunds);
router.post('/transfer', WalletController.transfer);
router.post('/withdraw', WalletController.withdraw);

module.exports = router;