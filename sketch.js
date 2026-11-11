let country = "US";
let state = "New York";

window.addEventListener("load", () => {
    console.log("Page loaded, get the current date");
    const now = new Date();
    console.log(now);
    getForecast(country, state);

});

const weatherDay = {
    date: "",
    weekday: "",
    tempMax: 0,
    tempMin: 0,
    conditions: ""
}

async function getForecast(country, state) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country},${state}?unitGroup=us&include=days&elements=datetime,tempmax,tempmin,conditions`;
  console.log(`Fetching weather data from: ${url}`);
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let result = await response.json();
    console.log(result);
    let weatherData = createWeatherData(result);
    console.log(weatherData);
    displayForecast(weatherData);
  } catch (error) {
    console.error(error.message);
  }

  
}

function updateCountry() {
  let countryInput = document.getElementById("country-input");
  country = countryInput.value;
}

function updateState() {
  let stateInput = document.getElementById("state-input");
  state = stateInput.value;
}

function createWeatherData(result) {
    if (!result || !result.days || result.days.length === 0) {
        console.error("No weather data available.");
        return;
    }

    let weatherData = [];
    let days = result.days;
    for (let i = 0; i < days.length; i++) {
        const dayData = days[i];
        const weatherDay = {
            date: dayData.datetime,
            weekday: new Date(dayData.datetime).toLocaleDateString('en-US', { weekday: 'long' }),
            tempMax: dayData.tempmax,
            tempMin: dayData.tempmin,
            conditions: dayData.conditions
        };
        weatherData.push(weatherDay);
    }
    return weatherData;
}

function displayForecast(weatherData) {
    for (let i = 0; i < weatherData.length; i++) {
        const day = weatherData[i];
        const dayElement = document.getElementById(`${day.weekday.toLowerCase()}-forecast`);
        if (dayElement) {
            dayElement.querySelector(`#${day.weekday.toLowerCase()}-date`).textContent = day.date;
            dayElement.querySelector(`#${day.weekday.toLowerCase()}-high-temp`).textContent = `High: ${day.tempMax}°F`;
            dayElement.querySelector(`#${day.weekday.toLowerCase()}-low-temp`).textContent = `Low: ${day.tempMin}°F`;
            dayElement.querySelector(`#${day.weekday.toLowerCase()}-conditions`).textContent = day.conditions;
        }
    }
    highlightCurrentDay();
}

function highlightCurrentDay() {
    let currDay = new Date().toLocaleDateString('en-US', { weekday: 'long'}).toLowerCase();
    let currDayTemp = document.getElementById(`${currDay}-forecast`);
    if (currDayTemp != null) {
        currDayTemp.classList.add("current-day");
    }
    console.log(currDayTemp);  
}