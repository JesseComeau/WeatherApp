var cityName = '';
var object = '';
var futureDays = [];
var cities = [];


function geocode() {
  cityName = document.getElementById("citySearch").value;
  let openWeatherApi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=223b07ab844eb3a89b0adf469a858b67`;

  fetch(openWeatherApi).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (data) {
        validateCity(data)
      });
    } else {
      console.log(`error ${response.status}`);
    }
  });
}

function validateCity(data) {
  cities = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].country == "US") {
      cities.push(data[i]);
    }
  }
  modalbody(cities)
}

function modalbody(cities) {
  let modalBodyEl = document.getElementById("modalBody");
  modalBodyEl.innerHTML = '';
  for (let i = 0; i < cities.length; i++) {
    console.log(cities[i].name)
    modalBodyEl.innerHTML += `<button class='my-1' value='${i}' onclick='getWeather(event)'>${cities[i].name}, ${cities[i].state}</button><br>`;
  }
}

function getWeather(event) {
  let i = event.path[0].value;
  let city = cities[i];
  let lat = city.lat;
  let lon = city.lon;
  let forecast = [];
  let openWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=223b07ab844eb3a89b0adf469a858b67&units=imperial`;
  
  fetch(openWeatherApi).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (data) {
        forecast = data
        displayWeather(forecast, city)
      });
    } else {
      console.log(`error ${response.status}`);
    }
  });
  
  
}

function displayWeather (forecast, city) {

  let mainCityEl = document.getElementById('mCity');
  let mainTempEl = document.getElementById('mTemp');
  let mainWindEl = document.getElementById('mWind');
  let mainHumEl = document.getElementById('mHum');
  let mainUVEl = document.getElementById('mUV');
  console.log(forecast)
  mainCityEl.innerText = city.name;
  mainTempEl.innerText = forecast.current.temp;
  mainWindEl.innerText = forecast.current.wind_speed;
  mainHumEl.innerText = forecast.current.humidity;
  mainUVEl.innerText = forecast.current.uvi;

}