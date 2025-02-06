const { dailyTransactionLimit } = require("../config/config")

const Transaction = require("../models/Transaction")
const User = require("../models/User")

const checkFraudulent = async (userId, amount) => {
    const user = await User.findById(userId);
    const today = new Date();

    if (user.lastTransactionReset.getDate() !== today.getDate()) {
        user.dailyTransactionTotal = 0;
        user.lastTransactionReset = today
        await user.save();
    }

    if (user.dailyTransactionTotal + amount > dailyTransactionLimit) {
        return {
            isFraudulent: true,
            reason: 'Daily transaction limit exceeded',
        };
    }

    const recentTransactions = await Transaction.find({
        userId,
        amount: { $gt: 1000 },
        timestamp: { $gte: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      });

      if (amount > 1000 && recentTransactions.length >= 3) {
        return {
          isFraudulent: true,
          reason: 'Multiple high-value transactions detected',
        };
      }

      return { isFraudulent: false };
      
}

module.exports = checkFraudulent;