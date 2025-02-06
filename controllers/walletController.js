const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const CurrencyService = require('../services/currencyService');
const checkFraudulent = require('../middleware/fraudDetection');
const User = require('../models/User');

class WalletController {
  static async getBalance(req, res) {
    try {
      const wallet = await Wallet.findOne({ userId: req.user._id });
      res.json({ balance: wallet.balance, currency: wallet.currency });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addFunds(req, res) {
    try {
      const { amount, currency } = req.body;
      const wallet = await Wallet.findOne({ userId: req.user._id });

      const convertedAmount = await CurrencyService.convertAmount(
        amount,
        currency,
        wallet.currency
      );

      const fraudCheck = await checkFraudulent(req.user._id, convertedAmount);
      if (fraudCheck.isFraudulent) {
        return res.status(400).json({ error: fraudCheck.reason });
      }

      wallet.balance += convertedAmount;
      await wallet.save();

      const transaction = new Transaction({
        userId: req.user._id,
        type: 'credit',
        amount: convertedAmount,
        currency: wallet.currency,
        description: 'Add funds',
      });
      await transaction.save();

      await User.findByIdAndUpdate(req.user._id, {
        $inc: { dailyTransactionTotal: convertedAmount },
      });

      res.json({ message: 'Funds added successfully', newBalance: wallet.balance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async transfer(req, res) {
    try {
      const { recipientEmail, amount } = req.body;
      
      const recipient = await User.findOne({ email: recipientEmail });
      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not found' });
      }

      const senderWallet = await Wallet.findOne({ userId: req.user._id });
      const recipientWallet = await Wallet.findOne({ userId: recipient._id });

      if (senderWallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      const fraudCheck = await checkFraudulent(req.user._id, amount);
      if (fraudCheck.isFraudulent) {
        return res.status(400).json({ error: fraudCheck.reason });
      }

      const convertedAmount = await CurrencyService.convertAmount(
        amount,
        senderWallet.currency,
        recipientWallet.currency
      );

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        senderWallet.balance -= amount;
        recipientWallet.balance += convertedAmount;
        
        await senderWallet.save({ session });
        await recipientWallet.save({ session });

        const senderTransaction = new Transaction({
          userId: req.user._id,
          type: 'debit',
          amount,
          currency: senderWallet.currency,
          description: `Transfer to ${recipientEmail}`,
          recipientId: recipient._id,
        });

        const recipientTransaction = new Transaction({
          userId: recipient._id,
          type: 'credit',
          amount: convertedAmount,
          currency: recipientWallet.currency,
          description: `Transfer from ${req.user.email}`,
          recipientId: req.user._id,
        });

        await senderTransaction.save({ session });
        await recipientTransaction.save({ session });

        await User.findByIdAndUpdate(
          req.user._id,
          { $inc: { dailyTransactionTotal: amount } },
          { session }
        );

        await session.commitTransaction();
        res.json({ message: 'Transfer successful', newBalance: senderWallet.balance });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
    static async withdraw(req, res) {
        try {
          const { amount } = req.body;
          const wallet = await Wallet.findOne({ userId: req.user._id });
    
          if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
          }
    
          const fraudCheck = await checkFraudulent(req.user._id, amount);
          if (fraudCheck.isFraudulent) {
            return res.status(400).json({ error: fraudCheck.reason });
          }
    
          wallet.balance -= amount;
          await wallet.save();
    
          const transaction = new Transaction({
            userId: req.user._id,
            type: 'debit',
            amount,
            currency: wallet.currency,
            description: 'Withdrawal',
          });
          await transaction.save();
    
          await User.findByIdAndUpdate(req.user._id, {
            $inc: { dailyTransactionTotal: amount },
          });
    
          res.json({ message: 'Withdrawal successful', newBalance: wallet.balance });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
    }

  module.exports = WalletController;
