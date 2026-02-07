let url = "https://restcountries.com/v3.1/name/";

let searchBtn = document.querySelector("#searchBtn");
let textStatus = document.querySelector("#statusText");
let input = document.querySelector("#country");
let result = document.querySelector("#result");

// ===============================
// MAIN DASHBOARD FUNCTION
// ===============================
async function countryDashboard() {
  searchBtn.disabled = true;
  textStatus.innerText = "Fetching result...";
  result.innerHTML = "";

  let countryName = input.value.trim();

  if (countryName.length === 0) {
    textStatus.innerText = "Please enter a valid country name";
    searchBtn.disabled = false;
    return;
  }

  let data = await getCountryDetails(countryName);

  if (data.success) {
    textStatus.innerText = "Country details:";

    let img = document.createElement("img");
    let h2 = document.createElement("h2");
    let h3Capital = document.createElement("h3");
    let h3Region = document.createElement("h3");
    let h3Population = document.createElement("h3");

    img.src = data.flag;
    img.style.width = "150px";

    h2.innerText = data.name;
    h3Capital.innerText = "Capital: " + data.capital;
    h3Region.innerText = "Region: " + data.region;
    h3Population.innerText = "Population: " + data.population.toLocaleString();

    result.append(img, h2, h3Capital, h3Region, h3Population);
  } else {
    textStatus.innerText = data.error;
  }

  searchBtn.disabled = false;
}

// ===============================
// API FUNCTION
// ===============================
async function getCountryDetails(country) {
  try {
    let res = await axios.get(url + country);

    // always safest result
    let data =
    res.data.find(
        c => c.name.common.toLowerCase() === country.toLowerCase()
    ) || res.data[0];

    return {
      success: true,
      name: data.name.common,
      flag: data.flags.png,
      capital: data.capital ? data.capital[0] : "N/A",
      region: data.region,
      population: data.population
    };
  } catch (err) {
    let errMsg = "Something went wrong";

    if (err.response) {
      if (err.response.status === 404) {
        errMsg = "Country not found";
      } else if (err.response.status === 500) {
        errMsg = "Server error. Try again";
      }
    } else {
      errMsg = "Network error. Check internet";
    }

    return {
      success: false,
      error: errMsg
    };
  }
}

// ===============================
// EVENTS
// ===============================
searchBtn.addEventListener("click", countryDashboard);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    countryDashboard();
  }
});
