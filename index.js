//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const apifunctions = require('./modules/functions/api')
dotenv.config();
let jsonData = require('./public/stocks.json')
const bodyParser = require('body-parser');



//set up Express app
const app = express();
const port = process.env.PORT || 5000;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

const stockList = [{  name:'MSFT', qty:10},{  name:'GOOGL', qty:20}]
const cryptoList = [{  name:'BTC', qty:0.2},{  name:'ETH', qty:0.2}]

//PAGE ROUTES
//name auto suggestion route - auto.pug -not implemented in routes 

app.get("/", async (request, response) => {

  //console.log(stockList)

  let pv = await apifunctions.getStockPrice("IBM")

 
  let total = await apifunctions.getStockValue(stockList);
  //let maxMar = await apifunctions.maxMargin(stockList);

 // let availableCryptos = await apifunctions.getCryptoPrice(cryptoList[0].name);
  let etherium  = await apifunctions.getCryptoPrice('ETH');

  let cryptoTotal = await apifunctions.getCryptoValue(cryptoList);
 //console.log(cryptoTotal);
  let totalPledge = parseInt(total)+parseInt(cryptoTotal);
  let marginShortfall = 10000-totalPledge;
  response.render("index", {stockList:stockList,
                             cryptoList:cryptoList,
                               total:total,
                               cryptoTotal:cryptoTotal,
                               totalPledge:totalPledge,
                               marginShortfall:marginShortfall
                                                     
                            });
});

app.get('/addstock',(req,res)=>{
  res.render('addstock')
});

app.get('/addcrypto',(req,res)=>{
  res.render('addcrypto')
});

app.get ('/top50list',async(req,res)=>{
  let top50StocksArray =  apifunctions.getTop50Stocks(jsonData);
 // console.log(top50StocksArray );
  res.render('top50list',{title:"Top 50 list",top50StocksArray:top50StocksArray })
});

app.post("/addstock/addStockItem/submit", async (req, res) => {
    
  let newStockItem = {
      name: req.body.stockName,
      qty: req.body.stockQty,
      
    
   };
   stockList.push(newStockItem);
   
   res.redirect("/");
  });

app.post("/addcrypto/addCryptoItem/submit", async (req, res) => {
    
  let newCryptoItem = {
      name: req.body.cryptoName,
      qty: req.body.cryptoQty,
      
    
   };
   cryptoList.push(newCryptoItem);
   
   res.redirect("/");
  });

// app.post('/addStockItem', (req, res) => {
//   //const { stockName, stockQty } = req.body;
  
//     let newStockItem = { name: req.body.stockName,
//                            qty: req.body.stockQty };
//     stockList.push(newStockItem);

//   res.redirect('/');
// });



//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


