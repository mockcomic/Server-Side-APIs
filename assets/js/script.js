let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#location");
let weatherContainerEl = document.querySelector("#container");
let weatherSearchTerm = document.querySelector("#search-term");
let fiveDayContainerEl = document.querySelector("#five-day");
let currentWeather = document.getElementById('container');
let currentTempEl = document.createElement("li");
let currentWindEl = document.createElement("li");
let currentHumidityEl = document.createElement("li");
let currentUVEl = document.createElement("li");
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
  weatherSearchTerm.textContent = location+ "-Current Weather";
  let fiveDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`
  console.log(fiveDayApi)
  fetch(fiveDayApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayFiveDay(data);
          let lat = data.city.coord.lat
          let lon = data.city.coord.lon
          let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=imperial`
          fetch(apiUrl)
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
        });
      } else {
        alert("Error: " + response.statusText);
      };
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

function displayCurrentWeather(data) {
  let currentWeatherContainer = document.createElement('div')
  currentTempEl.textContent = `Temp ${data.current.temp}°F`;
  currentWindEl.textContent = `Wind ${data.current.wind_speed}MPH`;
  currentHumidityEl.textContent = `Humidity ${data.current.humidity}%`;
  currentUVEl.textContent = `UV Index: ${data.current.uvi}`;
  currentWeatherContainer.classList.add('card-weather')
  if (data.current.uvi > 6) {
    currentUVEl.classList.add('danger');
  } else {
    currentUVEl.classList.add('good');
  };
  currentWeatherContainer.appendChild(currentTempEl);
  currentWeatherContainer.appendChild(currentWindEl);
  currentWeatherContainer.appendChild(currentHumidityEl);
  currentWeatherContainer.appendChild(currentUVEl);
  currentWeather.appendChild(currentWeatherContainer);

};

function displayFiveDay(data) {
  console.log(data)
  createWeatherCard(data, 4)
  createWeatherCard(data, 12)
  createWeatherCard(data, 20)
  createWeatherCard(data, 28)
  createWeatherCard(data, 36)

}
function createWeatherCard(data, dayNumber) {
  let weatherCardEl = document.createElement("ul");
  let dateEl = document.createElement("li");
  let tempEl = document.createElement("li");
  let windEl = document.createElement("li")
  let humidityEl = document.createElement("li");
  weatherCardEl.classList.add('card-weather')
  dateEl.textContent = `${data.list[dayNumber].dt_txt}`;
  tempEl.textContent = `Temp: ${data.list[dayNumber].main.temp}°F`;
  windEl.textContent = `Wind: ${data.list[dayNumber].wind.speed}MPH`;
  humidityEl.textContent = `Humidity: ${data.list[dayNumber].main.humidity}%`;
  weatherCardEl.appendChild(dateEl);
  weatherCardEl.appendChild(tempEl);
  weatherCardEl.appendChild(windEl);
  weatherCardEl.appendChild(humidityEl);
  fiveDayContainerEl.appendChild(weatherCardEl)
}

loadOldSearch()
userFormEl.addEventListener("submit", formSubmitHandler);