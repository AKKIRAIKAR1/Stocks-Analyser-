const apiKey = "YOUR_API_KEY"; // Replace with your Alpha Vantage API key
const searchBtn = document.getElementById("search-btn");
const stockSymbolInput = document.getElementById("stock-symbol");
const stockDataDiv = document.getElementById("stock-data");
const chartContainer = document.getElementById("chart-container");

searchBtn.addEventListener("click", async () => {
  const symbol = stockSymbolInput.value.trim();
  if (!symbol) {
    alert("Please enter a stock symbol.");
    return;
  }

  // Fetch stock data
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data["Error Message"]) {
    alert("Invalid stock symbol. Please try again.");
    return;
  }

  displayStockData(data, symbol);
});

function displayStockData(data, symbol) {
  const timeSeries = data["Time Series (Daily)"];
  const latestDate = Object.keys(timeSeries)[0];
  const latestData = timeSeries[latestDate];

  stockDataDiv.innerHTML = `
    <p><strong>Symbol:</strong> ${symbol}</p>
    <p><strong>Date:</strong> ${latestDate}</p>
    <p><strong>Open:</strong> ${latestData["1. open"]}</p>
    <p><strong>High:</strong> ${latestData["2. high"]}</p>
    <p><strong>Low:</strong> ${latestData["3. low"]}</p>
    <p><strong>Close:</strong> ${latestData["4. close"]}</p>
  `;

  plotChart(timeSeries);
}

function plotChart(timeSeries) {
  const labels = Object.keys(timeSeries).slice(0, 10).reverse();
  const closePrices = labels.map(date => timeSeries[date]["4. close"]);

  const ctx = document.getElementById("stock-chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Close Price",
          data: closePrices,
          borderColor: "rgba(0, 115, 230, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}


