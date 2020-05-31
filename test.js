const http = require('http');
const events = require('events');
const Binance = require( 'node-binance-api' );
require('dotenv').config();

// B i n a n c e - N o d e - A P I   O p t i o n s
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_SECRET,
  useServerTime: true,
  recvWindow: 2500, // Set a higher recvWindow to increase response timeout
  verbose: false, // Add extra output when subscribing to WebSockets, etc
  test: true,
  reconnect: true
  // to do: enable Logging
});

const symbol = 'BTCUSDT';
const quantity = 0.0016;

binance.balance((error, balances) => {
  if ( error ) return console.error(error);
  const usdtBal = balances.USDT.available;
  if (balances.USDT.available > 20.00) {
    binance.bookTickers('BTCUSDT', (error, ticker) => {
      tickAsk = ticker.askPrice;
      let qty = usdtBal/tickAsk;
      console.log(tickAsk, usdtBal, qty);
      binance.marketBuy(symbol, qty);
    });
  }
  else {
    console.log('Balance < 20.00')
  }
}) // binance.balance