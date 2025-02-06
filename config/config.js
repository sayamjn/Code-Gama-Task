module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    mongoURI: process.env.MONGO_URI,
    dailyTransactionLimit: 10000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
}