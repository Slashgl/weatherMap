import '../scss/style.scss'

const apiKey = `f6c065f36d3bf94559470b07bcf0d80c`
const myLocationLink = document.querySelector('.linkMyLocation')
const input = document.querySelector('.input');
const popupSearch = document.querySelector('.popup__search')
const popup = document.querySelector('.popup');
const popupBtn = document.querySelector('.popup__button');
const popupToClose = document.querySelector('.popup__close');

const countries = {};
let objCountries = {}

function getData(link) {
  return fetch(link)
    .then(res => res.json())
    .then(res => {
      return res
    })
}

function geoFindMe() {

  async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    countries.myLocation = {
      name: 'My Location',
      qwery: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    }

    const dataMyLocation = await getData(countries.myLocation.qwery)

    fetch('https://json.geoiplookup.io/')
      .then(res => res.json())
      .then(res => {
        document.querySelectorAll('.weather__city').forEach(city => city.innerHTML = res.city)
        myLocationLink.addEventListener('click', () => {
          document.querySelector('.weather__city').innerHTML = res.city
        })
      })

    document.querySelector('.coordsMyLocation').innerHTML = `H:${Math.floor(dataMyLocation.lat)}&deg L:${Math.floor(dataMyLocation.lon)}&deg`
    document.querySelectorAll('.degreesMyLocation').forEach(item => item.innerHTML = `${Math.round(dataMyLocation.current.temp)}&deg`)
    document.querySelectorAll('.descriptionMyLocation').forEach(item => item.innerHTML = dataMyLocation.current.weather.map(el => el.description.charAt(0).toUpperCase() + el.description.slice(1)))
    document.querySelector('.city').innerHTML = 'My Location'
    console.log(dataMyLocation)
    const callback = async (e) => {
      e.preventDefault();
      clearData();
      const data = await getData(countries.myLocation.qwery)
      render(data)
    }
    myLocationLink.addEventListener('click', callback)
    const data = await getData(countries.myLocation.qwery)

    render(data)
  }

  function error() {
    console.log('Невозможно получить ваше местоположение')
  }

  if (!navigator.geolocation) {
    console.log('Geolocation не поддерживается вашим браузером')
  } else {
    console.log('Определение местоположения…')
    navigator.geolocation.getCurrentPosition(success, error)
  }
}

geoFindMe()

function render(api) {

  const daysTemp = getDaysTemp(api.daily);
  const hourlyTemp = getHourlyTemp(api.hourly)
  const ulDayTemp = document.querySelector('.weather__list');
  const ulHourlyTemp = document.querySelector('.weather__frames');

  document.querySelectorAll('.degrees').forEach(item => item.innerHTML = `${Math.round(api.current.temp)}&deg`)
  document.querySelectorAll('.description').forEach(item => item.innerHTML = api.current.weather.map(el => el.description.charAt(0).toUpperCase() + el.description.slice(1)))
  document.querySelector('.weather__time-now').innerHTML = `${translationFromNowToTime(api.current.dt)}`
  document.querySelector('.sunrise').innerHTML = new Date(api.current.sunrise).toLocaleTimeString('ru-RU', {
    hour: '2-digit', minute: '2-digit'
  })
  document.querySelectorAll('.coords').forEach(coord => coord.innerHTML = `H:${Math.round(api.lat)}&deg L:${Math.round(api.lon)}&deg`)
  document.querySelector('.feels-like').innerHTML = `${Math.round(api.current.feels_like)}&deg`;
  document.querySelector('.humidity').innerHTML = `${Math.round(api.current.humidity)}%`
  document.querySelector('.visibility').innerHTML = `${api.current.visibility / 1000} км`

  daysTemp.forEach((day) => {
    const listItem = createListDayTemp(day);
    ulDayTemp.append(listItem);
  });
  hourlyTemp.forEach(hour => {
    hourlyTemp[0].hour = 'Now';
    const listItem = createListHourlyTemp(hour)
    ulHourlyTemp.append(listItem)
  })
}

const getDayOfTheWeek = timestamp => {
  const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = new Date();
  day.setTime(timestamp + '000');
  const dayNumber = day.getDay();
  return daysName[dayNumber];
};

const getAnHour = timestamp => {
  const timeName = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
  const time = new Date();
  time.setTime(timestamp + '000');
  const timeNumberHours = time.getHours();
  return timeName[timeNumberHours]
}

const getDaysTemp = data => {
  return data.map(item => {
    const day = getDayOfTheWeek(item.dt);
    return {
      day, minT: Math.round(item.temp.min), maxT: Math.round(item.temp.max), icon: item.weather.map(el => el.icon)
    };
  });
};
const getHourlyTemp = data => {
  return data.slice(0, 10).map(item => {
    const day = getAnHour(item.dt)
    return {
      hour: day, icon: item.weather.map(el => el.icon), degrees: Math.round(item.temp)
    }
  })
}


function createListDayTemp(day) {
  const li = document.createElement('li');
  li.classList.add('weather__item');
  li.innerHTML = `
    <div class="weather__weeks">
      <div class="weather__dt">${day.day}</div>
      <img class="weather__icon icon" src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${day.icon}.png" alt="icon">
    </div>
    <div class="weather__graphDegress">
      <div class="weather__degrees-min">${day.minT}&deg</div>
      <div class="weather__lineGraph">
        <span class="weather__range" style="left: ${30 + day.minT}px; width: ${30 + day.maxT}px"></span>
      </div>
      <div class="weather__degrees_max">${day.maxT}&deg</div>
    </div>
    `;
  return li;
}

function createListHourlyTemp(hourly) {
  const li = document.createElement('li');
  li.classList.add('weather__frame');
  li.innerHTML = `
    <div class="weather__frame_time">${hourly.hour}</div>
    <img class="weather__icon icon" src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${hourly.icon}.png" alt="icon">
    <div class="weather__frame_degrees average-daily-temperature">${hourly.degrees}&deg</div>
  `
  return li
}

popupSearch.onchange = ({target}) => getCountry(target)

function getCountry(target) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${target.value}&limit=5&appid=${apiKey}`)
    .then((res) => res.json())
    .then(res => {
      addingListResult(res)
    })
}

function addingListResult(api) {
  const ul = document.querySelector('.popup__results')
  ul.replaceChildren()
  api.map((city) => {
    const li = document.createElement('li');
    li.classList.add('popup__item')
    li.style.listStyle = 'none'
    li.innerHTML = `
    <div class="popup__wrapper">
        <div class="popup__name">${city.name}</div>
        <div class="popup__country">${city.state}</div>
    </div>
  `
    const divChecked = document.createElement('div');
    li.addEventListener('click', function clickedCountry() {

      divChecked.classList.toggle('checked')

      if (objCountries[city.name]) {
        delete objCountries[city.name]
      } else {
        objCountries[city.name] = {
          qwery: `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`,
          data: null
        }
      }
      console.log(objCountries)
    })
    input.addEventListener('click', () => {
      divChecked.classList.remove('checked')
    })
    li.append(divChecked)
    ul.append(li)
  })
}

popupBtn.addEventListener('click', () => {
  createCardCityToAside(objCountries)
})

async function createCardCityToAside() {

  const ulCardToAside = document.querySelector('.sidebar__list-city');

  for (const [key, value] of Object.entries(objCountries)) {
    const response = await getData(value.qwery)
    value.data = response
    const li = document.createElement('li');
    li.classList.add('sidebar__item-city')
    li.style.listStyle = 'none'
    li.innerHTML = `
    <div class="sidebar__left">
        <div class="weather__city">${key}</div>
        <div class="sidebar__time">${translationFromUnixToTime(response.current.dt)}</div>
        <div class="sidebar__description">${response.current.weather.map(el => el.description)}</div>
    </div>
        <div class="sidebar__right">
        <div class="sidebar__degrees">${Math.round(response.current.temp)}&deg</div>
        <div class="sidebar__coordinate">H:${Math.round(response.lat)}&deg L:${Math.round(response.lon)}&deg</div>
    </div>
    `
    li.addEventListener('click', () => {
      document.querySelector('.weather__city').innerHTML = key
      clearData()
      render(response)
    })
    ulCardToAside.append(li)
  }
}

function translationFromUnixToTime(timestamp) {
  const timeName = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  const time = new Date();
  time.setTime(timestamp * 1000)
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const hourTime = Number(timeName[hour])
  const addStringZero = String(minutes).length < 2 ? '0' + minutes : minutes
  if (hourTime === 12 && hourTime > 1 && hourTime <= 12) {
    return `${hourTime}:${addStringZero} AM`
  }
  return `${hourTime}:${addStringZero} PM`
}

function translationFromNowToTime() {
  const time = new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
  const hour = Number(time.slice(0, 2));
  if (hour === 12 && hour >= 1 && hour <= 12) {
    return `${hour + time.slice(2)} AM`
  }
  return `${hour + time.slice(2)} PM`
}

function clearData() {
  document.querySelectorAll('.weather__frames').forEach(el => el.innerHTML = '');
  document.querySelectorAll('.weather__list').forEach(el => el.innerHTML = '')
}

input.addEventListener('click', () => {
  popup.classList.toggle('active');
  objCountries = {};
})

popupBtn.addEventListener('click', () => {
  popup.classList.remove('active');
})

popupToClose.addEventListener('click', () => {
  popup.classList.remove('active');
})



