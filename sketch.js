const possibleLocales = [
  'en-US',
  'en-GB',
  'es-ES',
  'fr-FR',
  'de-DE',
  'ja-JP',
  'zh-CN',
  'ar-SA',
  'hi-IN',
  'invalid-locale'
]

let country = 'US'
let state = 'New York'
let sign = 'Pisces'

window.addEventListener('load', () => {
  console.log('Page loaded, get the current date')
  const now = new Date()
  console.log(now)
  getForecast(country, state)
})

const weatherDay = {
  date: '',
  weekday: '',
  tempMax: 0,
  tempMin: 0,
  conditions: ''
}

async function getForecast (country, state) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country},${state}?unitGroup=us&include=days&elements=datetime,tempmax,tempmin,conditions`
  // console.log(`Fetching weather data from: ${url}`)
  try {
    let response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    let result = await response.json()
    console.log(result)
    let weatherData = createWeatherData(result)
    console.log(weatherData)
    highlightCurrentDay(country)
    displayForecast(weatherData)
  } catch (error) {
    console.error(error.message)
  }
}

function updateCountry () {
  let countryInput = document.getElementById('country-input')
  country = countryInput.value
}

function updateState () {
  let stateInput = document.getElementById('state-input')
  state = stateInput.value
}

function createWeatherData (result) {
  if (!result || !result.days || result.days.length === 0) {
    console.error('No weather data available.')
    return
  }

  let weatherData = []
  let days = result.days
  for (let i = 0; i < days.length; i++) {
    const dayData = days[i]
    const weatherDay = {
      date: dayData.datetime,
      weekday: new Date(dayData.datetime).toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: 'UTC'
      }),
      tempMax: dayData.tempmax,
      tempMin: dayData.tempmin,
      conditions: dayData.conditions
    }
    weatherData.push(weatherDay)
  }
  return weatherData
}

function displayForecast (weatherData) {
  const displayedWeekdays = new Set()
  for (let i = 0; i < weatherData.length; i++) {
    const day = weatherData[i]
    const weekday = day.weekday.toLowerCase()
    if (displayedWeekdays.has(weekday)) {
      continue
    }

    displayedWeekdays.add(weekday)
    const dayElement = document.getElementById(`${weekday}-forecast`)
    // console.log(Math.round(day.tempMax))
    if (dayElement) {
      dayElement.querySelector(`#${weekday}-date`).textContent = `${day.date}`
      dayElement.querySelector(`#${weekday}-date`).classList.add('forecast-date')
      dayElement.querySelector(`#${weekday}-high-temp`).textContent = `High: ${Math.round(day.tempMax)}F`
      document.getElementById(`${weekday}-high-temp`).classList.add('high-temp')
      dayElement.querySelector(`#${weekday}-low-temp`).textContent = `Low: ${Math.round(day.tempMin)}F`
      document.getElementById(`${weekday}-low-temp`).classList.add('low-temp')
      dayElement.querySelector(`#${weekday}-conditions`).textContent = `Conditions: ${day.conditions}`
      document.getElementById(`${weekday}-conditions`).classList.add('conditions')
      if(day.conditions == "Partially cloudy"){
      dayElement.querySelector(`#${weekday}-icon`).classList.add('fas', 'fa-cloud')     
     }
     else if(day.conditions == "Rain, Overcast" || day.conditions == "Rain"){
      dayElement.querySelector(`#${weekday}-icon`).classList.add('fas', 'fa-cloud-rain')     
     }
    else if(day.conditions == "Clear"){
          dayElement.querySelector(`#${weekday}-icon`).classList.add('fas', 'fa-sun')     
        }
    else if(day.conditions == "Snow"){
          dayElement.querySelector(`#${weekday}-icon`).classList.add('fas', 'fa-snowflake')     
        }    
    }
  }
}

function highlightCurrentDay (country) {
  console.log('country is : ' + country)
  let locale = checkLocation(country)
  console.log('locale is: ' + locale)
  let currDay = new Date()
    .toLocaleDateString(locale, { weekday: 'long' })
    .toLowerCase()

  let currDayTemp = document.getElementById(`${currDay}-forecast`)
  if (locale == 'en-us' || locale == 'en-US') {
    if (currDayTemp != null || currDayTemp != undefined) {
      console.log('currDayTemp is: ' + currDayTemp.value)

      currDayTemp.classList.add('current-day')
      document.getElementById(`${currDay}-row`).classList.add('current-day')
    }
  } else {
    let temp = document.getElementById(`${currDay}-forecast`)
    console.log('temp is: ' + temp)
    // currDayTemp.classList.remove('current-day')
    // document.getElementById(`${currDay}-row`).classList.remove('current-day')
  }
  return
}

function checkLocation (country) {
  let currLocale = 'en-us'
  if (country == 'United States' || country == 'US') {
    currLocale = 'en-us'
  } else if (this.country == 'United Kingdom' || this.country == 'UK') {
    currLocale = 'en-GB'
  } else if (this.country == 'Canada') {
    currLocale = 'en-CA'
  } else if (this.country == 'Spain') {
    currLocale = 'es-ES'
  } else if (this.country == 'Mexico') {
    currLocale = 'es-MX'
  } else if (this.country == 'France') {
    currLocale = 'fr-FR'
  } else if (this.country == 'Germany') {
    currLocale = 'de-DE'
  } else if (this.country == 'Brazil') {
    currLocale = 'pt-BR'
  } else if (country == 'Japan') {
    currLocale = 'ja-JP'
  } else if (this.country == 'South Korea') {
    currLocale = 'ko-KR'
  } else if (this.country == 'China') {
    currLocale = 'zh-TW'
  } else if (this.country == 'Saudi Arabia') {
    currLocale = 'ar-SA'
  } else if (this.country == 'India') {
    currLocale = 'hi-IN'
  } else if (this.country == 'Nigeria') {
    currLocale = 'yo-NG'
  } else if (this.country == 'Austrailia') {
    currLocale = 'en-AU'
  }
  return currLocale
}

async function getHoroscope(sign) {
  let url = `https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${sign}`
  console.log(`Fetching horoscope data from: ${url}`)
  try {
    let response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    let result = await response.json()
    let currSign = result.data.sign
    let currHoroscope = result.data.horoscope
    let horoscopeData = displayHoroscope(currSign, currHoroscope)
    console.log(horoscopeData)
  
  } catch (error) {
    console.error(error.message)
  }
}

function updateSign () {
  let signInput = document.getElementById('sign-input')
  sign = signInput.value
}

function displayHoroscope(sign, horoscope){
  const horoscopePanel = document.getElementById('horoscope-panel');
  // const horoscopeTitle = document.getElementById('horoscope-title');
  // const horoscopeText = document.getElementById('horoscope-text');
  console.log(sign +" "+ horoscope);
  console.log(horoscopePanel);

  horoscopePanel.querySelector(`#horoscope-title`).textContent = `Your Horoscope: ${sign}`
  horoscopePanel.querySelector(`#horoscope-text`).textContent = `${horoscope}`
  horoscopePanel.hidden = false;
}


function closeHoroscope(){
  const horoscopePanel = document.getElementById('horoscope-panel');
  horoscopePanel.hidden = true;
}