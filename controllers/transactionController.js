const Transaction = require('../models/Transaction');

class TransactionController {
    static async getTransactionHistory(req, res) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
  
        const transactions = await Transaction.find({ userId: req.user._id })
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .populate('recipientId', 'email');
  
        const total = await Transaction.countDocuments({ userId: req.user._id });
  
        res.json({
          transactions,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTransactions: total,
          },
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }

  module.exports = TransactionController;
