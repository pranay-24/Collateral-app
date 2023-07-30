


async function getStockPrice(symbol){

const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}&region=US`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f6b7e577d3mshdfafe2feb2606aep1221a3jsn497c2bd11f90',
		'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	//console.log(result);
  const pv = result.summaryDetail.previousClose.raw;
  return pv;
} catch (error) {
	console.error(error);
}

}

//crytpo value function
async function getCryptoPrice(symbol){

const url = 'https://investing-cryptocurrency-markets.p.rapidapi.com/coins/list-pairs?time_utc_offset=28800&lang_ID=1';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f6b7e577d3mshdfafe2feb2606aep1221a3jsn497c2bd11f90',
		'X-RapidAPI-Host': 'investing-cryptocurrency-markets.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	//console.log(result);

  const length = result.data[0].screen_data.pairs_data.length;
  let cryptoPrice;
  for (let i =0;i< length;i++){
   if(symbol === result.data[0].screen_data.pairs_data[i].pair_name ){
     cryptoPrice = result.data[0].screen_data.pairs_data[i].last;
   }
  }
 
  return cryptoPrice ;
} catch (error) {
	console.error(error);
}


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

//}
async function maxMargin (stockList){
let total = await getStockValue(stockList);

let max = 0.8*total;

return max.toFixed(2);
}

async function getStockValue(stockList) {
  let total = 0;
  const promises = [];

  for (const node of stockList) {
    const promise = getStockPrice(node.name).then(price => {
      const qty = node.qty;
      const value = price * qty;
      total += value;
    });

    promises.push(promise);
  }

  await Promise.all(promises);
  console.log(total);
  return total.toFixed(2);
}

function getCryptoPriceAsync(pair) {
  return new Promise((resolve, reject) => {
    getCryptoPrice(pair)
      .then(price => resolve(price))
      .catch(error => reject(error));
  });
}

    
async function getCryptoValue1(cryptoList) {
  let total = 0;
  let price1 = 0;
let value;
  function getCryptoPriceAsync(pair) {
    return new Promise((resolve, reject) => {
      getCryptoPrice(pair)
        .then(price => resolve(price))
        .catch(error => reject(error));
    });
  }

  try {
    const [bitcoinPrice, etheriumPrice, bitcoincashPrice, ripplecoinPrice] = await Promise.all([
      getCryptoPriceAsync('BTC/USD'),
      getCryptoPriceAsync('ETH/USD'),
      getCryptoPriceAsync('BCH/USD'),
      getCryptoPriceAsync('XRP/USD')
    ]);

    console.log(bitcoinPrice, etheriumPrice, bitcoincashPrice, ripplecoinPrice);
    console.log(typeof(bitcoinPrice));
    for (const node of cryptoList) {
      if (node.name === 'BTC/USD') {
        price1 = bitcoinPrice;
        console.log(typeof(price1));
       // console.log(node.name);
      //  console.log(price1);
      } else if (node.name === 'ETH/USD') {
        price1 =etheriumPrice;
      } else if (node.name === 'BCH/USD') {
        price1 = bitcoincashPrice;
      } else if(node.name === 'XRP/USD'){
        price1 = ripplecoinPrice;
      }
      // console.log(node.qty);
      // console.log(price1);

      value = price1 * node.qty;
      //console.log(parseInt(price1) * parseInt(node.qty));
      total += value;
    }
    return total;
  } catch (error) {
    console.error('Error occurred:', error);
    return 'Error occurred';
  }
}


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
  maxMargin,
  getCryptoPrice,
  getCryptoValue,
  getCryptoValue1
};