
class CurrencyService {
  static async getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;

    try {
      const rates = {
        'USD_EUR': 0.85,
        'EUR_USD': 1.18,
        'USD_GBP': 0.73,
        'GBP_USD': 1.37,
        'USD_JPY': 110.0,
        'JPY_USD': 0.0091,
      };

      const rate = rates[`${fromCurrency}_${toCurrency}`];
      if (!rate) throw new Error('Exchange rate not available');

      return rate;
    } catch (error) {
      throw new Error('Failed to fetch exchange rate');
    }
  }

  static async convertAmount(amount, fromCurrency, toCurrency) {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }
}

module.exports = CurrencyService;
