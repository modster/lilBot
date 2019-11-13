/*
 *  LilBot:
 *  The simplest little nodejs trade bot ever.
 */
const binance = require( 'node-binance-api' )().options({
  APIKEY: '<your public key>',
  APISECRET: '<your private key>',
  useServerTime: true, // <--------------- If you get timestamp errors, synchronize to server time at startup
  recvWindow: 5000, // <------------------ Once you're up and running lower this, 5 seconds is an eternity
  reconnect: true,
  test: true, // <----------------------- Test Mode is enabled by default. Events return empty objects.
  verbose: false
});
const http = require('http');
const events = require('events');

const symbol = 'BTCUSDT';
const quantity = 0.025
const hostname = '127.0.0.1';
const port = 80;

// Are we in test mode?
console.log ("Test Mode: ", binance.getOption('test'));


var eventEmitter = new events.EventEmitter();

eventEmitter.on('error', (err) => {
  console.error(err);
})


/*
*                  M A R K E T  O R D E R   -   B U Y  
*   For a limit order just add a third parameter, 'price', to marketBuy
*/
eventEmitter.on('buy', () => {
  binance.marketBuy(symbol, quantity, (error, response) => {
    if (error) {
    console.error(error);
    }
    console.log(response)
    console.log("Bought " + quantity + " Order Id: " + response.orderId);
  });
})


/*
 *                  M A R K E T   O R D E R  -  S E L L
 *   For a limit order just add a third parameter, 'price', to marketSell
 */
eventEmitter.on('sell', () => {
  binance.marketSell(symbol, quantity, (error, response) => {
    if (error) {
      console.error(error); 
    }
    console.log(response)
    console.log('Sold ' + quantity + ' Order Id: ', + response.orderId);
  });
})


/*
 * Thanks to nodejs.org for the following server, lifted straight from thier "Getting Started" 
 * tutorial.
 */
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