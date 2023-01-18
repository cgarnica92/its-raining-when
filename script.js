//Global Variables
var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var weatherContainer = document.querySelector('#weather-container')

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderCurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');
    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;

    var card = document.createElement('div');
    var heading = document.createElement('h2');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    heading.textContent = `${city} (${date})`;
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    card.append(heading, tempEl, windEl, humidityEl);

    weatherContainer.innerHTML = '';
    weatherContainer.append(card);
}

function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
  
    var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderCurrentWeather(city, data.list[0], data.city.timezone);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

function handleSearchFormSubmit(e) {
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }

  searchForm.addEventListener('submit', handleSearchFormSubmit);