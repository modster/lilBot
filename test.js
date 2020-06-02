const Binance = require( 'node-binance-api' );
const http = require('http');
const events = require('events');
require('dotenv').config();

// B i n a n c e - N o d e - A P I   O p t i o n s
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_SECRET,
  useServerTime: true,
  recvWindow: 2000, // Set a higher recvWindow to increase response timeout
  verbose: false, // Add extra output when subscribing to WebSockets, etc
  test: false,
  reconnect: true
  // to do: enable Logging
});

const symbol = 'BTCUSDT';
const hostname = '127.0.0.1';
const port = 80;

// Are we in test mode?
console.log ("Test Mode: ", binance.getOption('test'));

binance.balance((error, balances) => {
  if ( error ) {
    console.error(error);
    return;
  }
  //console.log("balances()", balances);
  console.log("BTC balance: ", balances.BTC.available);
  if( balances.BTC.available ) {
    binance.marketSell('BTCUSDT', balances.BTCavailable)
  }
  else {
    console.log('BTC Balance = 0')
  }
})