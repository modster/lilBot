# 'lil Bot
## The littlest crypto bot

Don't you wish you could use TrandingView charts, strategies and indicators to trade REAL crypto? You can! Using TradingView alerts, this repo, and Binance's robust API. 

When an alert is triggered on your chart a webhook contacts this app.js script and tells it to place a buy/sell market order on the binance exchange. 

## Requirements:

### Clone this repo

[Download](https://github.com/modster/lilBot) 
Extract it to a convenient location.

### Binance Trading Account

[API key](https://www.binance.com/en/support/articles/360002502072)
Log in and create a new api key. Beginners should disable withdrawls. Remember to restrict access to your device's external ip. Copy/paste your info into options.json.

### NodeJS 

[Download](https://nodejs.org/en/download)

### Ngrok  

[Download](https://ngrok.com/download)
Sign up for an account and follow the instructions. Ngrok should be in the same folder as app.js.

## TradingView Charts 

To use webhooks we need TradingView **Pro** ($10.95/month).
[Get a $30 credit by visiting this affiliate link](https://www.tradingview.com/gopro/?share_your_love=Greeffer).

## Create a new bot:

After the pre-requisits are installed open a terminal in the cloned repository and run the following commands:

``` bash
npm init -y

npm install
```

## Start:

To start run the following in your terminal.

``` bash

./ngrok http 80

nodemon app.js
```

## Tips

Ngrok changes your url on startup, so you'll have to copy/paste the new url into your TradingView webhooks. Upgrade to ngrok pro to solve this. Don't forget to create an [auth token](https://ngrok.com/docs#getting-started-authtoken).

For testing webhooks go to http://localhost:4040 and select "replay". You can feed your bot any 
value you want without having to wait for your alerts to be triggered. 

To use the example pine scripts just copy/paste them into the tradingview pine editor at the bottom of your chart. By clicking 'new' a drop down menu displays many default scripts you can easily clone and edit to create your own custom indicators.
