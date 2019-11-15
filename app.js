/*
 *  LilBot:
 *  The tiniest little crypto bot ever.
 */
const binance = require( 'node-binance-api' )().options('./options.json');

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
