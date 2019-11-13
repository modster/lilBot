/*
 *  LilBot:
 *  The simplest little crypto bot ever. 
 *  
 *  Nodejs is required, then run these commands in project folder:
 *  npm init
 *  npm install node-binance-api --save
 *  
 *  Next, get ngrok from https://ngrok.com/. Follow the instructions then copy and paste the url
 *  given into your tradingview.com pro alerts. Note: ngrok free changes the url every time it's 
 *  started.
 *  
 *  To start the tunnel (windows/linux):
 *  ./ngrok http 80 
 * 
 *  To run lilBot:
 *  node app.js
 * 
 *  For testing webhooks go to http://localhost:4040 and select "replay". You can feed your bot any 
 *  value without having to wait for your alerts to be triggered. 
 *  
 *  Good luck and have fun!
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

// Make the EventEmitter that will be triggered by our webhooks
var eventEmitter = new events.EventEmitter();

// Error handling
eventEmitter.on('error', (err) => {
  console.error(err);
})


/*
*                  M A R K E T  O R D E R   -   B U Y  
*   For a limit order just add a third parameter, 'price', to marketBuy
*/
eventEmitter.on('buy', () => {
  if (error) {
    console.error(error);
    return;
  }
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
  if (error) {
    console.error(error);
  }
  binance.marketSell(symbol, quantity, (error, response) => {
    if (error) {
      console.error(error); 
    }
    console.log(response)
    console.log('Sold ' + quantity + ' Order Id: ', + response.orderId);
  });
})


/*
 * Thanks to nodejs.org for the following server, lifted straight from thier "Getting Started" tutorial.
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
    } else {
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