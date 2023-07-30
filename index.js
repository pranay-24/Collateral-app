//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const apifunctions = require('./modules/functions/api')
dotenv.config();


//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

//PAGE ROUTES
app.get("/", async (request, response) => {
  const stockList = [{  name:'TSLA', qty:'10'},{  name:'MSFT', qty:'20'}]
  const cryptoList = [{  name:'BTC/USD', qty:'2'},{  name:'ETH/USD', qty:'1'}]


 
  let pv = await apifunctions.getStockPrice("TSLA");
  let total = await apifunctions.getStockValue(stockList);
  let maxMar = await apifunctions.maxMargin(stockList);

  let availableCryptos = await apifunctions.getCryptoPrice(cryptoList[0].name);
  let etherium  = await apifunctions.getCryptoPrice('ETH/USD');

  let cryptoTotal = await apifunctions.getCryptoValue1(cryptoList);
 console.log(cryptoTotal);
 
  response.render("index", { 
                             pv:pv, total:total,
                             maxMar:maxMar,
                             availableCryptos,
                             cryptoTotal:cryptoTotal,
                             etherium :etherium });
});



//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


