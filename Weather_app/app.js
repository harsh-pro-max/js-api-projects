let inputData = document.querySelector("#inpData");
let searchBtn = document.querySelector("#searchBtn");
let statusText = document.querySelector(".statusText");
let resultBox = document.querySelector("#resultBox");

let apiKey = "623d6907f530be5c5b85d6a953f18750";

// ================= WEATHER DASHBOARD =================
async function weatherShowDashboard() {
  let city = inputData.value.trim();

  if (city.length === 0) {
    statusText.innerText = "Please enter a city name";
    return;
  }

  searchBtn.disabled = true;
  statusText.innerText = "Fetching weather data...";
  resultBox.innerHTML = "";

  let data = await getWeatherData(city);

  if (data.success === false) {
    statusText.innerText = data.error;
    searchBtn.disabled = false;
    return;
  }

  statusText.innerText = "";

  resultBox.innerHTML = `
    <h2>${city.toUpperCase()}</h2>
    <p class="temp">${data.temp}°C</p>
    <p class="condition">${data.main} (${data.description})</p>

    <div class="details">
      <p>Feels Like: ${data.feels_like}°C</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Pressure: ${data.pressure} hPa</p>
      <p>Wind Speed: ${data.speed} m/s</p>
    </div>
  `;

  searchBtn.disabled = false;
}

// ================= BUTTON EVENT =================
searchBtn.addEventListener("click", weatherShowDashboard);

// ================= ENTER KEY =================
inputData.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    weatherShowDashboard();
  }
});

// ================= API FUNCTION =================
async function getWeatherData(city) {
  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    let res = await axios.get(url);

    console.log(res.data);
    return {
      success: true,
      temp: res.data.main.temp,
      feels_like: res.data.main.feels_like,
      humidity: res.data.main.humidity,
      pressure: res.data.main.pressure,
      description: res.data.weather[0].description,
      main: res.data.weather[0].main,
      speed: res.data.wind.speed
    };
  } catch (err) {
    let errMsg = "Something went wrong";

    if (err.response) {
      if (err.response.status === 404) errMsg = "City not found";
      else if (err.response.status === 401) errMsg = "Invalid API key";
    } else {
      errMsg = "Network error. Check internet";
    }

    return {
      success: false,
      error: errMsg
    };
  }
}
