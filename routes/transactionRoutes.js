const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);
router.use(apiLimiter);

router.get('/history', TransactionController.getTransactionHistory);

module.exports = router;