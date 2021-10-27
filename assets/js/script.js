let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#location");
let weatherSearchTerm = document.querySelector("#search-term");
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
  weatherSearchTerm.textContent = location + "-Current Weather";
  let fiveDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`
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
  document.getElementById('current-temp').textContent = 'Temp'+data.current.temp+'°F';
  document.getElementById('current-wind').textContent = `Wind ${data.current.wind_speed}MPH`;
  document.getElementById('current-humidity').textContent = `Humidity ${data.current.humidity}%`;
  document.getElementById('current-UV').textContent = `UV Index: ${data.current.uvi}`;
  if (data.current.uvi > 6) {
    document.getElementById('current-UV').classList.remove('good');
    document.getElementById('current-UV').classList.add('bad');
  } else {
    document.getElementById('current-UV').classList.remove('bad');
    document.getElementById('current-UV').classList.add('good');
  };
};

function displayFiveDay(data) {
  editWeatherCard(data, 4, 'one')
  editWeatherCard(data, 12, 'two')
  editWeatherCard(data, 20, 'three')
  editWeatherCard(data, 28, 'four')
  editWeatherCard(data, 36, 'five')

}

function editWeatherCard(data, dataNumber, day) {
  document.getElementById(`${day}-date`).textContent = `${data.list[dataNumber].dt_txt}`;
  document.getElementById(`${day}-temp`).textContent = `Temp: ${data.list[dataNumber].main.temp}°F`;
  document.getElementById(`${day}-wind`).textContent = `Wind: ${data.list[dataNumber].wind.speed}MPH`;
  document.getElementById(`${day}-humidity`).textContent = `Humidity: ${data.list[dataNumber].main.humidity}%`;
}

loadOldSearch()
userFormEl.addEventListener("submit", formSubmitHandler);