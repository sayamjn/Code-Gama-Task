const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts from this IP, please try again later.',
});

module.exports = { apiLimiter, authLimiter };
