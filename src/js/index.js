import '../scss/style.scss'
const apiKey = `f6c065f36d3bf94559470b07bcf0d80c`
const input = document.querySelector('.input');
const popup = document.querySelector('.popup');
const popupBtn = document.querySelector('.popup__button');
function getData(link) {
  fetch(link)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      render(res)
    })

}

  // input.onkeyup = debounce(({target}) =>
  //     fetch(`https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}`)
  //       .then((res) => res.json())
  //       .then(res => {
  //         console.log(res)
  //
  //       }),
  //   500
  // )


function geoFindMe() {
  const myLocationLink = document.querySelector('.linkMyLocation')

  myLocationLink.href = '';

  function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      myLocationLink.href = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    getData(myLocationLink)
  }
  function error() {
    console.log('Невозможно получить ваше местоположение')
  }

  if(!navigator.geolocation) {
    console.log('Geolocation не поддерживается вашим браузером')
  }else {
    console.log('Определение местоположения…')
    navigator.geolocation.getCurrentPosition(success,error)
  }
}

function render(api) {
  const daysTemp = getDaysTemp(api.daily);
  const hourlyTemp = getHourlyTemp(api.hourly)
  const ulDayTemp = document.querySelector('.weather__list');
  const ulHourlyTemp = document.querySelector('.weather__frames');

  document.querySelectorAll('.degrees').forEach( item => item.innerHTML = `${Math.round(api.current.temp)}&deg`)
  document.querySelectorAll('.description').forEach(item => item.innerHTML = api.current.weather.map(el => el.description.charAt(0).toUpperCase() + el.description.slice(1)) )
  document.querySelector('.weather__time-now').innerHTML = `${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`
  document.querySelector('.sunrise').innerHTML = new Date(api.current.sunrise).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
  document.querySelectorAll('.coords').forEach(coord => coord.innerHTML = `H:${Math.round(api.lat)}: L:${Math.round(api.lon)}`)
  document.querySelector('.feels-like').innerHTML = `${Math.round(api.current.feels_like)}&deg`;
  document.querySelector('.humidity').innerHTML = `${Math.round(api.current.humidity)}%`
  document.querySelector('.visibility').innerHTML = `${api.current.visibility / 1000} км`

  daysTemp.forEach(day => {
    const listItem = createListDayTemp(day);
    ulDayTemp.append(listItem);
  });
  hourlyTemp.forEach(hour => {
    const listItem = createListHourlyTemp(hour)
    ulHourlyTemp.append((listItem))
  })

}
const getDayOfTheWeek = timestamp => {
  const daysName = ['Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const day = new Date();
  day.setTime(timestamp + '000');

  const dayNumber = day.getDay();
  return daysName[dayNumber];
};
const getAnHour = timestamp => {
  const daysName = ['','Now', '10AM','11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];
  const time = new Date();
  time.setTime(timestamp + '000');
  const timeNumber = time.getHours();
  console.log(daysName[timeNumber])
  return daysName[timeNumber]
}

const getDaysTemp = data => {
  return data.map(item => {
    const day = getDayOfTheWeek(item.dt);
    return {
      day,
      minT: Math.round(item.temp.min),
      maxT: Math.round(item.temp.max),
      icon: item.weather.map(el => el.icon)
    };
  });
};
const getHourlyTemp = data => {
  return data.slice(0, 10).map(item => {
    const day = getAnHour(item.dt)
    return {
      hour: day,
      icon: item.weather.map(el => el.icon),
      degrees: Math.round(item.temp)
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
      <div class="weather__lineGraph"></div>
      <div class="weather__degrees_max">${day.maxT}&deg</div>
    </div>
    `;
  return li;
}
function  createListHourlyTemp(hourly) {
  const li = document.createElement('li');
  li.classList.add('weather__frame');
  li.innerHTML = `
    <div class="weather__frame_time">${hourly.hour}</div>
    <img class="weather__icon icon" src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${hourly.icon}.png" alt="icon">
    <div class="weather__frame_degrees average-daily-temperature">${hourly.degrees}&deg</div>
  `
  return li
}

input.addEventListener('click', () => {
  popup.classList.toggle('active')
})
popupBtn.addEventListener('click', () => {
  popup.classList.remove('active')
})


document.addEventListener('DOMContentLoaded',  (e) =>{
  geoFindMe();
})
document.querySelector('.linkMyLocation').addEventListener('click',  (e) =>{
  geoFindMe()
})
