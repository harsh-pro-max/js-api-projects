let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let searchBtn = document.querySelector("#FindBtn");
let wordInput = document.querySelector("#inputWord");
let statusText = document.querySelector("#statusText");
let resultBox = document.querySelector("#showResult");

// MAIN SEARCH FUNCTION

async function searchWord() {
  searchBtn.disabled = true;
  statusText.innerText = "Searching...";
  resultBox.innerHTML = "";

  let word = wordInput.value.trim();

  if (word.length === 0) {
    statusText.innerText = "Please enter a valid word";
    searchBtn.disabled = false;
    return;
  }

  let data = await getWordData(word);

  if (data.success) {
    let h2 = document.createElement("h2");
    let p1 = document.createElement("p");
    let ol = document.createElement("ol");

    h2.innerText = word;
    p1.innerText = data.partOfSpeech;

    resultBox.appendChild(h2);
    resultBox.appendChild(p1);

    data.definitions.forEach(def => {
      let li = document.createElement("li");
      li.innerText = def.definition;
      ol.appendChild(li);
    });

    resultBox.appendChild(ol);
    statusText.innerText = "";
  } else {
    statusText.innerText = data.error;
  }

  searchBtn.disabled = false;
}

// BUTTON CLICK
searchBtn.addEventListener("click", searchWord);

// ENTER KEY SUPPORT
wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchWord();
  }
});

// API FUNCTION
async function getWordData(word) {
  try {
    let res = await axios.get(url + word);

    return {
      success: true,
      partOfSpeech: res.data[0].meanings[0].partOfSpeech,
      definitions: res.data[0].meanings[0].definitions
    };

  } catch (err) {
    let errMsg = "Something went wrong";

    if (err.response) {
      if (err.response.status === 404) {
        errMsg = "Word not found";
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
