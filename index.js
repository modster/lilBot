var http = require('http');
const Binance = require('node-binance-api');
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

const port = 80

async function buy () {
  try {
    let usdtBal, qty, price;
    let balances_data = await binance.futuresBalance(), assets = Object.keys( balances_data );
    for ( let asset of assets ) {
      let obj = balances_data[asset], bal = Number( obj.balance );
      if ( obj.asset == 'USDT' ) {
        console.log(`USDT balance: ${bal}`);
        usdtBal = bal;
        //const response = await binance.futuresMarketBuy( 'BTCUSDT', qty ) <-----------------------!
        //console.log(response) <--------------------------------------------------------------------!
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function sell () {
  try {
    let qty = 0.0016;
    let balances_data = await binance.futuresBalance(), assets = Object.keys( balances_data );
    for ( let asset of assets ) {
      let obj = balances_data[asset], bal = Number( obj.balance );
      if ( obj.asset == 'USDT' ) { // <-------------------------------------------------CHANGE TO BTC
        console.log(`BTC balance ${bal}`);
        qty = bal * 0.1;
        console.log(`10% of BTC balance ${qty}`);
        // response = await binance.futuresMarketSell( 'BTCUSDT', qty ) <-------------------------------UNCOMMENT
        // console.log( response )
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function stop () {
  try {
    let balances_data = await binance.futuresBalance(), assets = Object.keys( balances_data );
    for ( let asset of assets ) {
      let obj = balances_data[asset], bal = Number( obj.balance );
      if ( obj.asset == 'BTC' ) {
        console.log(bal);
        //const response = await binance.futuresMarketSell( 'BTCUSDT', bal ) <-------------------------------!
        //console.log(response) <----------------------------------------------------------------------------!
      }
    }
  } catch (error) {
    console.error(error)
  }
}

//create a server object:
http.createServer(function (req, res) {
  if(req.url == '/balances') {
    balances();
    message = 'Balances Success';
  }
  else if(req.url == '/stop') {
    stop();
    message = 'Stop Success';
  }
  else if(req.url == '/buy') {
    buy();
    message = 'Buy Success';
  }
  else if(req.url == '/sell') {
    sell();
    message = 'Sell Success';
  }
  else {
    message = '404';
  }
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(message); //write a response to the client
  res.end(); //end the response

}).listen(port); //the server object listens on port 80
console.log('Listening on ' + port)