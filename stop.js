
eventEmitter.on('stop', () => {
  binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    let btcBalance = balances.BTC.available;
    binance.marketSell(symbol, btcBalance);
  }) // binance.balance
}) // end eventemitter.on('stop')

