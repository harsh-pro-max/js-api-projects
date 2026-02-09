let movieInp = document.querySelector("#movieInp");
let searchBtn = document.querySelector("#searchBtn");
let statusText = document.querySelector("#statusText");
let movieResult = document.querySelector("#movieResult");

const baseURL = "https://www.omdbapi.com/";
const apiKey = "57696ef3";

// ================= MAIN SEARCH =================
async function handleSearch() {
  let movieName = movieInp.value.trim();

  if (movieName.length === 0) {
    statusText.innerText = "Please enter a movie name";
    return;
  }

  searchBtn.disabled = true;
  statusText.innerText = "Searching movies...";
  movieResult.innerHTML = "";

  let data = await fetchMovies(movieName);

  if (!data) {
    statusText.innerText = "Movie not found";
    searchBtn.disabled = false;
    return;
  }

  statusText.innerText = "";

  for (let i = 0; i < data.length; i++) {
    let movie = data[i];

    // ---------- MOVIE CARD ----------
    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    // Poster
    let poster = document.createElement("img");
    poster.alt = movie.Title;

    if (movie.Poster !== "N/A") {
      poster.src = movie.Poster;
    } else {
      poster.src = "https://via.placeholder.com/200x300?text=No+Image";
    }

    // Title
    let title = document.createElement("h3");
    title.innerText = movie.Title;

    // Year
    let year = document.createElement("p");
    year.innerText = "Release Year: " + movie.Year;

    // Append order (VERY IMPORTANT)
    movieCard.appendChild(poster);
    movieCard.appendChild(title);
    movieCard.appendChild(year);

    movieResult.appendChild(movieCard);
  }

  searchBtn.disabled = false;
}

// ================= API CALL =================
async function fetchMovies(movieName) {
  try {
    const url = `${baseURL}?s=${movieName}&apikey=${apiKey}`;
    let res = await axios.get(url);

    if (res.data.Response === "False") {
      return null;
    }

    return res.data.Search;

  } catch (err) {
    statusText.innerText = "Network error. Try again";
    return null;
  }
}

// ================= EVENTS =================
searchBtn.addEventListener("click", handleSearch);

movieInp.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});
