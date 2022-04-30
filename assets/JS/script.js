var cityName = '';
var object = '';
var futureDays = [];
var cities = [];
var previousCities = [];
var forecast = [];
var savedData = [];


function geocode() {
  cityName = document.getElementById("citySearch").value;
  let openWeatherApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=95353ec9c8fa3b0e90a8e0ba6a8eacd5`;

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

function getWeather(event) {
  let i = event.path[0].value;
  var city = cities[i];
  let lat = city.lat;
  let lon = city.lon;
  let openWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=95353ec9c8fa3b0e90a8e0ba6a8eacd5&units=imperial`;
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
  console.log(city)
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
  uvIndexColor()
  displayForecast()
  currentIcons()
  updateLocalStorage(city)
}

function displayForecast() {
  let forecastCards = document.getElementById("forecastCards");
  forecastCards.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    let dF = forecast.daily[i]
    let date = new Date(dF.dt * 1000).toLocaleDateString("en-US");
    forecastCards.innerHTML += `<div class="col border text-white forecastCard ">
    <div class="h5 pt-1 pb-2">${date}
    
    </div>
    <div class="h6 py-1 px-1">High: ${dF.temp.max} &#8457</div>
    <div class="h6 py-1 px-1">Low: ${dF.temp.min} &#8457</div>
    <div class="h6 py-1 px-1">Wind: ${dF.wind_speed}</div>
    <div class="h6 py-1 px-1">Humidity: ${dF.humidity}</div>
    <div id='forecastIcon${i}'></div>
    </div>`
  }
  forecastIcons()
}

function currentIcons() {
  let weaId = forecast.daily[0].weather[0].id
  let weaDesc = forecast.daily[0].weather[0].description

  let weatherIconEl = document.getElementById('currentIcons')
  if (weaId >= 200 && weaId <= 299) {
    weatherIconEl.innerHTML = `<div class='row'>
    <p class='h1 py-1 pt-4'><i class="fa-solid fa-cloud-bolt"></i></p>
    <br>
    <p class='h4 pt-4'>${weaDesc}</p>
    <div>`

  }
  if (weaId >= 500 && weaId <= 599) {
    weatherIconEl.innerHTML = `<div class='row'>
    <p class='h1 py-1 pt-4'><i class="fa-solid fa-cloud-rain"></i></p>
    <br>
    <p class='h4 pt-4'>${weaDesc}</p>
    <div>`

  }
  if (weaId == 800) {
    weatherIconEl.innerHTML = `<div class='row'>
    <p class='h1 py-1 pt-4'><i class="fa-solid fa-sun"></i></p>
    <br>
    <p class='h4 pt-4'>${weaDesc}</p>
    <div>`

  }
  if (weaId == 801 || weaId == 802) {
    weatherIconEl.innerHTML = `<div class='row'>
    <p class='h1 py-1 pt-4'><i class="fa-solid fa-cloud-sun"></i></p>
    <br>
    <p class='h4 pt-4'>${weaDesc}</p>
    <div>`

  }
  if (weaId == 803 || weaId == 804) {
    weatherIconEl.innerHTML = `<div class='row'>
    <p class='h1 py-1 pt-4'><i class="fa-solid fa-cloud"></i></p>
    <br>
    <p class='h4 pt-4'>${weaDesc}</p>
    <div>`

  }
}

function forecastIcons() {
  for (let i = 1; i <= 5; i++) {
    let weaId = forecast.daily[i].weather[0].id
    let weaDesc = forecast.daily[i].weather[0].description
    let weatherIconEl = document.getElementById(`forecastIcon${i}`)

    if (weaId >= 200 && weaId <= 299) {
      weatherIconEl.innerHTML += `<div class='row'>
      <p class='h3 py-1 pt-4'><i class="fa-solid fa-cloud-bolt"></i>
      <span class='h6 pt-2'>${weaDesc}</span>
      <div>`

    }
    if (weaId >= 500 && weaId <= 599) {
      weatherIconEl.innerHTML += `<div class='row'>
      <p class='h3 py-1 pt-4'><i class="fa-solid fa-cloud-rain"></i>
      <span class='h6 pt-2'>${weaDesc}</span>
      <div>`

    }
    if (weaId == 800) {
      weatherIconEl.innerHTML += `<div class='row'>
      <p class='h3 py-1 pt-4'><i class="fa-solid fa-sun"></i>
      <span class='h6 pt-2'>${weaDesc}</span>
      <div>`

    }
    if (weaId == 801 || weaId == 802) {
      weatherIconEl.innerHTML += `<div class='row'>
    <p class='h3 py-1 pt-4'><i class="fa-solid fa-cloud-sun"></i>
    <span class='h6 pt-2'>${weaDesc}</span>
    <div>`

    }
    if (weaId == 803 || weaId == 804) {
      weatherIconEl.innerHTML += `<div class='row'>
    <p class='h3 py-1 pt-4'><i class="fa-solid fa-cloud"></i>
    <span class='h6 pt-2'>${weaDesc}</span>
    <div>`

    }
  }

}
function uvIndexColor() {
  let mainUVEl = document.getElementById('mUV');
  if (forecast.current.uvi <= 2) {
    mainUVEl.classList.add('bg-success', 'rounded', 'text-white', 'text-center')
  }
  else if (forecast.current.uvi <= 5) {
    mainUVEl.classList.add('bg-success', 'rounded', 'text-white', 'text-center')
  }
  else if (forecast.current.uvi <= 7) {
    mainUVEl.classList.add('bg-success', 'rounded', 'text-white', 'text-center')
  }
  else if (forecast.current.uvi <= 9) {
    mainUVEl.classList.add('bg-success', 'rounded', 'text-white', 'text-center')
  }
  else if (forecast.current.uvi >= 11) {
    mainUVEl.classList.add('bg-success', 'rounded', 'text-white', 'text-center')
  }
}

function pageLoad() {
  let defaultData = [
    {
      name: 'Austin',
      state: 'Texas',
      lat: '30.2711286',
      lon: '-97.7436995'
    },
    {
      name: 'Chicago',
      state: 'Illinois',
      lat: '41.8755616',
      lon: '-87.6244212'
    },
    {
      name: 'New York',
      state: 'New York',
      lat: '40.7127281',
      lon: '-74.0060152'
    },
    {
      name: 'Orlando',
      state: 'Florida',
      lat: '28.5421109',
      lon: '-81.3790304'
    },
    {
      name: 'San Francisco',
      state: 'California',
      lat: '37.7790262',
      lon: '-122.419906'
    },
    {
      name: 'Seattle',
      state: 'Washington',
      lat: '47.6038321',
      lon: '-122.3300624'
    },
    {
      name: 'Denver',
      state: 'Colorado',
      lat: '39.7392364',
      lon: '-104.9848623'
    },
    {
      name: 'Atlanta',
      state: 'Georgia',
      lat: '33.7489924',
      lon: '-84.3902644'
    },
  ];
  if (localStorage.getItem("weatherApp") == null) {
    savedData = defaultData
  }
  else {
    lsData = localStorage.getItem("weatherApp")
    savedData = JSON.parse(lsData)
    console.log(savedData)
  }

  for (let i = 0; i <= 7; i++) {
    let rowIndex = document.getElementById(`row${i}`)
    rowIndex.innerText = `${savedData[i].name}, ${savedData[i].state}`
    rowIndex.setAttribute('value', i);

  }

}

function initializeWeather() {
  city = savedData[0]
  let lat = savedData[0].lat;
  let lon = savedData[0].lon;
  let openWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=95353ec9c8fa3b0e90a8e0ba6a8eacd5&units=imperial`;
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

pageLoad()
initializeWeather()
function updateLocalStorage(city) {
  console.log(city)
  if (city.name != savedData[0].name) {
    let addData = {
      name: city.name,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    }
    savedData.unshift(addData);
    savedData.pop();
    console.log(savedData)
    localStorage.setItem('weatherApp', JSON.stringify(savedData))
  }
  pageLoad();

}

function savedCity(event) {
  let buttonValue = event.path[0].attributes[3].value
  city = savedData[buttonValue]
  let lat = savedData[buttonValue].lat;
  let lon = savedData[buttonValue].lon;
  let openWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=95353ec9c8fa3b0e90a8e0ba6a8eacd5&units=imperial`;
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