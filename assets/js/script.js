let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#location");
let weatherContainerEl = document.querySelector("#container");
let weatherSearchTerm = document.querySelector("#search-term");
let fiveDayContainerEl = document.querySelector("#five-day");
let apiKey = '30399c9472d3ee86640e4f68e9cf9b12'
let oldSearch = [];

function loadOldSearch() {
  try {
    oldSearch = JSON.parse(localStorage.getItem("location"));
    for (let i = 0; i < oldSearch.length; i++) {
      let searchEl = document.createElement('button');
      searchEl.textContent = `${oldSearch[i]}`;
      searchEl.classList.add('btn-results');
      searchEl.classList.add('btn');
      document.querySelector("#search-results").appendChild(searchEl);
    };
    let savedResults = document.querySelectorAll(".btn-results");
    for (let i = 0; i < savedResults.length; i++) {
      savedResults[i].addEventListener('click', function () {
        nameInputEl.value = savedResults[i].innerHTML;
      });
    };
  } catch (error) {
    console.log(error)
    oldSearch = [];
  }
}

function formSubmitHandler(event) {
  event.preventDefault();

  let location = nameInputEl.value.trim();

  if (location) {
    getLocationWeather(location);
    oldSearch.push(location);

    localStorage.setItem("location", JSON.stringify(oldSearch));
    weatherContainerEl.textContent = "";
    nameInputEl.value = "";

    let newLocation = document.createElement('button');
    newLocation.classList.add('btn-results');
    newLocation.classList.add('btn');
    newLocation.textContent = location;

    document.querySelector("#search-results").appendChild(newLocation);
    newLocation.addEventListener('click', function () {
      nameInputEl.value = newLocation.innerHTML;
    });
  } else {
    alert("Please enter a location");
  }
};

function getLocationWeather(location) {
  let fiveDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`
  console.log(fiveDayApi)
  fetch(fiveDayApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);
          displayFiveDay(data);
        });
      } else {
        alert("Error: " + response.statusText);
      };
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });

    let apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
    console.log(apiCurrent)
    fetch(apiCurrent)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCurrentWeather(data);
        });
      } else {
        alert("Error: " + response.statusText);
      };
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });

    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=imperial`





};

function displayCurrentWeather(data) {
  console.log(data)
  let fiveDay = document.getElementById('container');
  let currentTempEl = document.createElement("li");
  let currentWindEl = document.createElement("li");
  let currentHumidityEl = document.createElement("li");

  weatherSearchTerm.textContent = data.name;
  currentTempEl.textContent = `Temp ${data.main.temp}`;
  currentWindEl.textContent = `Wind ${data.wind.speed}`;
  currentHumidityEl.textContent = `Humidity ${data.main.humidity}`;

  fiveDay.appendChild(currentTempEl);
  fiveDay.appendChild(currentWindEl);
  fiveDay.appendChild(currentHumidityEl);

};

function displayFiveDay(data) {

  console.log(data.list)
  console.log(data.list[1].wind.speed)

  createWeatherCard(data,1)


}

function createWeatherCard(data,dayNumber) {
  let weatherCardEl = document.createElement("ul");
  let dateEl = document.createElement("li");
  let tempEl = document.createElement("li");
  let windEl = document.createElement("li")
  let humidityEl = document.createElement("li");
  dateEl.textContent = `${data.list[dayNumber].dt_txt}`;
  tempEl.textContent = `Temp: ${data.list[dayNumber].main.temp}°F`;
  windEl.textContent = `Wind: ${data.list[1].wind.speed}MPH`;
  humidityEl.textContent = `Humidity: ${data.list[dayNumber].main.humidity}%`;
  weatherCardEl.appendChild(dateEl);
  weatherCardEl.appendChild(tempEl);
  weatherCardEl.appendChild(windEl);
  weatherCardEl.appendChild(humidityEl);
  fiveDayContainerEl.appendChild(weatherCardEl)
}

loadOldSearch()
userFormEl.addEventListener("submit", formSubmitHandler);