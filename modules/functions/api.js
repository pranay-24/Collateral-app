
const dotenv = require("dotenv").config();

const alpha_key = process.env.ALPHA_API_KEY
// const swapzone_key = process.env.SWAPZONE_API_KEY
const marketstack_key = process.env.MARKETSTACK_API_KEY
const coinAPI_key = process.env.COINAPI_KEY

//const TSX_API_URL = `https://www.alphavantage.co/query?function=SECTOR&apikey=${alpha_key}`;

async function getStockPrice(symbol){

  let attempts = 0 ;
  let maxAttempts = 3 ;
  let rate = null ; 

  let url = `http://api.marketstack.com/v1/eod?access_key=${marketstack_key}&symbols=${symbol}`
  while(attempts <maxAttempts){
    try{

   
   const response = await fetch(url);

  
    // const timeSeries = result['data']
    // const firstDate = Object.keys(timeSeries)[0]
    // const firstDailyPrice = timeSeries[firstDate];
    // const firstOpenPrice = parseFloat(firstDailyPrice['open']);
if (response.ok){
        const result = await response.json();
        rate = result.data[0].open;
        break;

      }else{
        attempts++;
        await new Promise (resolve => setTimeout(resolve,1000))
      }
  }catch(error){
    attempts++;
    await new Promise (resolve => setTimeout(resolve,1000))
  }
}
    return rate;


    }
  //  const rate = firstOpenPrice;


async function getCryptoPrice(symbol){
  
 let url = `https://rest.coinapi.io/v1/exchangerate/${symbol}/USD`
  fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
    
  })
let attempts = 0 ;
let maxAttempts = 3 ;
let rate = null ; 

while(attempts <maxAttempts){
  try{
    const response = await fetch(url, 
      { headers: {
         "X-CoinAPI-Key": coinAPI_key // Replace with your API key
         }
       }
         );
      if (response.ok){
        const result = await response.json();
        rate = result.rate ;
        break;

      }else{
        attempts++;
        await new Promise (resolve => setTimeout(resolve,1000))
      }
  }catch(error){
    attempts++;
    await new Promise (resolve => setTimeout(resolve,1000))
  }
}
  return rate;
}


// async function getStockValue(stockList){
//   let total=0;
// for(const node of stockList){
  
//   const price = await getStockPrice(node.name);
//   console.log(price);
//   const qty = node.qty;
 
//   const value = price * qty;
//   total += value;
//   console.log(total);
// }
// //console.log(total);
// return  total ; 
// //

// }
async function getStockValue(stockList) {
  let total = 0;
  const promises = [];
console.log(stockList);
  for (const node of stockList) {
    const promise = getStockPrice(node.name).then(price => {
console.log(price);
      if (!isNaN(price) && isFinite(price)){
      const qty = node.qty;
      const value = price * qty;
      total += value;
       console.log(total)
      }
      else {
        console.log(`Invalid price received for ${node.name}`); 
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);
  console.log(total);
  return total.toFixed(2);
}

 function calculatePortfolioValue(list){
  let total = 0;
list.forEach(async function (node){
  let price = await getStockPrice(node.name);
  let qty = node.qty;
  total += price * qty;

})
return total;

}


  function getTop50Stocks(data) {
    const result = data.map(stock => ({
      name: stock.company,
      symbol: stock.symbol
    }));
    return result;
  }
  

  
// function getCryptoPriceAsync(pair) {
//   return new Promise((resolve, reject) => {
//     getCryptoPrice(pair)
//       .then(price => resolve(price))
//       .catch(error => reject(error));
//   });
// }

    
// async function getCryptoValue1(cryptoList) {
//   let total = 0;
//   let price1 = 0;
// let value;
//   // function getCryptoPriceAsync(pair) {
//   //   return new Promise((resolve, reject) => {
//   //     getCryptoPrice(pair)
//   //       .then(price => resolve(price))
//   //       .catch(error => reject(error));
//   //   });
//   // }

//   // try {
//   //   const [bitcoinPrice, etheriumPrice, bitcoincashPrice, ripplecoinPrice] = await Promise.all([
//   //     getCryptoPriceAsync('BTC/USD'),
//   //     getCryptoPriceAsync('ETH/USD'),
//   //     getCryptoPriceAsync('BCH/USD'),
//   //     getCryptoPriceAsync('XRP/USD')
//   //   ]);

//   //   console.log(bitcoinPrice, etheriumPrice, bitcoincashPrice, ripplecoinPrice);
//   //   console.log(typeof(bitcoinPrice));
//   //   for (const node of cryptoList) {
//   //     if (node.name === 'BTC/USD') {
//   //       price1 = parseInt(bitcoinPrice.trim());
//   //       console.log(typeof(price1));
//   //      // console.log(node.name);
//   //     //  console.log(price1);
//   //     } else if (node.name === 'ETH/USD') {
//   //       price1 =parseInt(etheriumPrice.trim());
//   //     } else if (node.name === 'BCH/USD') {
//   //       price1 = bitcoincashPrice;
//   //     } else if(node.name === 'XRP/USD'){
//   //       price1 = ripplecoinPrice;
//   //     }
//   //     // console.log(node.qty);
//   //     // console.log(price1);

//   //     value = price1 * node.qty;
//   //     //console.log(parseInt(price1) * parseInt(node.qty));
//   //     total += value;
//   //   }
//   //   return total;
//   // } catch (error) {
//   //   console.error('Error occurred:', error);
//   //   return 'Error occurred';
//   // }
// }


async function getCryptoValue(cryptoList) {
  let total = 0;
  const promises = [];
console.log(cryptoList[0].name);
  for (const node of cryptoList) {
    const promise = getCryptoPrice(node.name).then(price => {

      if (!isNaN(price) && isFinite(price)){
      const qty = node.qty;
      const value = price * qty;
      total += value;
      // console.log(total)
      }
      else {
        console.log(`Invalid price received for ${node.name}`); 
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);
  console.log(total);
  return total.toFixed(2);
}



module.exports = {
  
   getStockPrice,
  getStockValue,
  
  getCryptoPrice,
  getCryptoValue,
  getTop50Stocks
};