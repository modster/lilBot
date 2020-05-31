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
  test: true,
  reconnect: true
  // to do: enable Logging
});

const binance = new Binance().options('./options.json'); // <---- TODO: tweak recvWindo

const symbol = 'BTCUSDT';
const quantity = 0.015;
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

    if (error) {
      console.error(error);
      return;
    }
    
    if (balances.USDT.available > 20.00) {
    
    /*
     *                  M A R K E T  O R D E R   -   B U Y  
     */
      binance.marketBuy(symbol, quantity, (error, response) => {
        if (error) {
        console.error(error);
        }
        console.log(response)
        console.log("Bought " + quantity + " Order Id: " + response.orderId);
      }); // marketBuy 
    } // if
  }) // binance.balance
}) // eventemitter.on('buy')

eventEmitter.on('sell', () => {

  binance.balance((error, balances) => {

    if (error) {
      console.error(error);
      return false;
    }
    
    if ( balances.BTC.available > quantity ) {   
      /*
      *                  M A R K E T   O R D E R  -  S E L L
      */
      binance.marketSell(symbol, quantity, (error, response) => {
        if (error) {
          console.error(error); 
        }
        console.log(response)
        console.log('Sold ' + quantity + ' Order Id: ', + response.orderId);
      }); // marketSell 
    } // if
  }) // binance.balance
}) // end eventemitter.on('sell')

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

    console.log(body);
    res.statusCode = 200;
    res.end();
    }
  )}
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});