const jwt = require("jsonwebtoken")
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const config = require('../config/config');
const bcrypt = require("bcryptjs")

class AuthController {
  static async register(req, res) {
    try {
        const { email, password, defaultCurrency } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            defaultCurrency,
        });
        await user.save();

        const wallet = new Wallet({
            userId: user._id,
            currency: defaultCurrency,
        });
        await wallet.save();

        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
  
    static async login(req, res) {
      try {
          const { email, password } = req.body;
          console.log(req.headers.authorization);

          if (!email || !password) {
              return res.status(400).json({
                  error: 'Email and password are required'
              });
          }

          console.log('Login attempt for email:', email);

          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
              console.log('User not found:', email);
              return res.status(401).json({
                  error: 'Invalid credentials'
              });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
              console.log('Invalid password for user:', email);
              return res.status(401).json({
                  error: 'Invalid credentials'
              });
          }

          console.log('Login successful for user:', user._id);

          const token = jwt.sign(
              { userId: user._id },
              config.jwtSecret,
              { expiresIn: '24h' }
          );

          res.json({
              message: 'Login successful',
              token,
              userId: user._id
          });

      } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({
              error: 'Login failed',
              details: error.message
          });
      }
  }


  
    static async getProfile(req, res) {
      try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  
  module.exports = AuthController;