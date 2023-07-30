const input = document.getElementById('stockInput');
const autocompleteList = document.getElementById('autocompleteList');
let selectedStock = '';

async function getStockSuggestions(stockName) {
  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${stockName}&region=US`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f6b7e577d3mshdfafe2feb2606aep1221a3jsn497c2bd11f90',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.quotes.map(quote => quote.symbol);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function displaySuggestions(suggestions) {
  autocompleteList.innerHTML = '';
  suggestions.forEach(symbol => {
    const li = document.createElement('li');
    li.textContent = symbol;
    autocompleteList.appendChild(li);
  });
}

input.addEventListener('input', async (e) => {
  const stockName = e.target.value.trim();
  if (stockName.length > 0) {
    const suggestions = await getStockSuggestions(stockName);
    displaySuggestions(suggestions);
  } else {
    autocompleteList.innerHTML = '';
  }
});

function selectStock(stockSymbol) {
  selectedStock = stockSymbol;
  document.getElementById('stockInput').value = stockSymbol;
  autocompleteList.innerHTML = '';
}

autocompleteList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const stockSymbol = e.target.textContent;
    selectStock(stockSymbol);
  }
});