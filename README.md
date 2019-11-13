## Requirements:

NodeJS (nodejs.org)

Ngrok (ngrok.com)

TradingView Charts (tradingview.com)


## Install:

mkdir project-folder
  
cd project-folder
  
npm init

npm install node-binance-api --save



## Start (windows/linux):

./ngrok http 80

node app.js


For testing webhooks go to http://localhost:4040 and select "replay". You can feed your bot any 
value you want without having to wait for your alerts to be triggered. 

Yes, you can use variables in tradingview webhooks: https://www.tradingview.com/chart/GFSFmOla/ 

TradingView Basic does not support Webhooks. Currently 
only Pro Version or better supports webhooks. The cost is 10.95 monthly
If you visit this link I get a free month, and so do you: 
https://www.tradingview.com/gopro/?share_your_love=Greeffer

