var cityName = '';
var object = '';
var futureDays = [];
var cities = [];
var previousCities = [];

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
    modalBodyEl.innerHTML += `<button class='my-1' value='${i}' data-bs-dismiss="modal" onclick='getWeather(event)'>${cities[i].name}, ${cities[i].state}</button><br>`;
  }
}

let forecast = [];
function getWeather(event) {
  let i = event.path[0].value;
  let city = cities[i];
  let lat = city.lat;
  let lon = city.lon;
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

function displayWeather(forecast, city) {
  let date = new Date(forecast.current.dt * 1000).toLocaleDateString("en-US")
  let mainCityEl = document.getElementById('mCity');
  let mainTempEl = document.getElementById('mTemp');
  let mainTempMaxEl = document.getElementById('mTempMax');
  let mainTempMinEl = document.getElementById('mTempMin');
  let mainWindEl = document.getElementById('mWind');
  let mainHumEl = document.getElementById('mHum');
  let mainUVEl = document.getElementById('mUV');
  mainUVEl.removeAttribute('class')
  mainCityEl.innerHTML = `${city.name}, ${city.state}  &nbsp;&nbsp;&nbsp; ${date}`;
  mainTempEl.innerHTML = `${forecast.current.temp} &#8457`;
  mainTempMaxEl.innerHTML = `${forecast.daily[0].temp.max} &#8457`;
  mainTempMinEl.innerHTML = `${forecast.daily[0].temp.min} &#8457`;
  mainWindEl.innerText = forecast.current.wind_speed;
  mainHumEl.innerHTML = `${forecast.current.humidity} <i class="fa-solid fa-droplet-percent"></i>`;
  mainUVEl.innerText = forecast.current.uvi
  console.log(forecast.daily[0].temp.max)
  uvIndexColor(forecast)
  displayForecast(forecast)
}

function uvIndexColor() {
  let mainUVEl = document.getElementById('mUV');
  if (forecast.current.uvi <= 2) {
    mainUVEl.classList.add('bg-success')
  }
  else if (forecast.current.uvi <= 5) {
    mainUVEl.classList.add('bg-warning')
  }
  else if (forecast.current.uvi <= 7) {
    mainUVEl.classList.add('bg-orange')
  }
  else if (forecast.current.uvi <= 9) {
    mainUVEl.classList.add('bg-danger')
  }
  else if (forecast.current.uvi >= 11) {
    mainUVEl.classList.add('bg-purple')
  }
}

function displayForecast(forecast) {
  let forecastCards = document.getElementById("forecastCards");
  forecastCards.innerHTML = '';
  console.log(forecast.daily[1])
  for (let i = 1; i <= 5; i++) {
    let dF = forecast.daily[i]
    let date = new Date(dF.dt * 1000).toLocaleDateString("en-US");
    forecastCards.innerHTML += `<div class="col border">
    <div class="row h5 pt-1 pb-2">${date}
  
    </div>
    <div class="row h6 py-1">High: ${dF.temp.max} &#8457</div>
    <div class="row h6 py-1">Low: ${dF.temp.min} &#8457</div>
    <div class="row h6 py-1">Wind: ${dF.wind_speed}</div>
    <div class="row h6 py-1">Humidity: ${dF.humidity}</div>
    </div>`    
  }
}