/* W O R K I N G  T I T L E 
 * TradingView charts and indicators are the best. I prefer them to Binance's 
 * charts, so I made a bot that uses TradingView indicators, strategies, and
 * alerts. It's simple enough that even a javascript novice can start using 
 * it right away. Working Title was designed to be used as a base for other 
 * projects.
 * 
 * Working Title makes extensive use of Jon Eryck's Node-Binance-API project
 * which can be found here: https://github.com/jaggedsoft/node-binance-api
 * Thanks Jon!
 *****************************************************************************/
const Binance = require( 'node-binance-api' );
const http = require('http');
const events = require('events');
require('dotenv').config();

// B i n a n c e - N o d e - A P I   O p t i o n s
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_SECRET,
  useServerTime: true,
  recvWindow: 1500, // Set a higher recvWindow to increase response timeout
  verbose: false, // Add extra output when subscribing to WebSockets, etc
  test: false,
  reconnect: true
  // to do: enable Logging
});

const symbol = 'BTCUSDT';
const quantity = 0.0016;
const hostname = '127.0.0.1';
const port = 80;

// Are we in test mode?
console.log ("Test Mode: ", binance.getOption('test'));

var eventEmitter = new events.EventEmitter();

eventEmitter.on('error', (err) => {
  console.error(err);
})

eventEmitter.on('buy', () => {

  binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    if (balances.USDT.available > 10.00) {
      binance.bookTickers('BTCUSDT', (error, ticker) => {
        tickAsk = ticker.askPrice;
        let qty = usdtBal/tickAsk;
        qty = qty.toFixed(5);
        console.log(tickAsk, usdtBal, qty);
        binance.marketBuy(symbol, qty);
      });
    }
    else {
      console.log('Balance < 10.00')
    }
  }) // binance.balance
}) // eventemitter.on('buy')

eventEmitter.on('sell', () => {

  binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    
    if ( balances.BTC.available > quantity ) {
      binance.marketSell(symbol, quantity);
    }
    console.log(balances.BTC.available);
  }) // binance.balance
}) // end eventemitter.on('sell')

//  S T O P
eventEmitter.on('stop', () => {
  
  binance.balance((error, balances) => {
    if ( error ) return console.error(error);

    if( balances.BTC.available > 0) {
      btcBalance = parseFloat(balances.BTC.available);
      console.log(btcBalance);
      binance.marketSell(symbol, btcBalance);
    }
  }) // binance.balance
  
}) // end eventemitter.on('stop')

const server = http.createServer((req, res) => {
  //const { headers, method, url } = req;
  let body = [];
  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    if(body === 'buy') { 
      eventEmitter.emit('buy'); // <----------------------- BUY
    } 
    
    if(body === 'sell') {
      eventEmitter.emit('sell'); // <---------------------- SELL
    }
    
    if(body === 'stop') {
      eventEmitter.emit('stop'); // <---------------------- SELL
    }
    console.log(body);
    res.statusCode = 200;
    res.end();
    }
  )}
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});