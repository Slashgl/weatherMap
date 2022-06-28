import '../scss/style.scss'

function getData(link) {
  fetch(link)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      render(res)
    })

}

function geoFindMe() {
  const myLocationLink = document.querySelector('.linkMyLocation')
  const apiKey = `f6c065f36d3bf94559470b07bcf0d80c`
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
  returnArray(api.daily).forEach((day) => {
    console.log(day)
  })
}

function returnArray(arr) {
  return arr.map( day => {
    return [day.dt, day.temp.min, day.temp.max]
  })
}

function createList() {
  const ul = document.querySelector('.weather__list');

  for (let i = 0; i < 9; i++) {
      const li = document.createElement('li');
      li.classList.add('weather__item');
      li.innerHTML = `
        <div class="weather__dt"></div>
        <div class="weather__degrees-min"></div>
        <div class="weather__degrees_max"></div>
      `
      ul.appendChild(li);
  }
}
createList()

document.addEventListener('DOMContentLoaded',  (e) =>{
  geoFindMe();
})
document.querySelector('.linkMyLocation').addEventListener('click',  (e) =>{
  e.preventDefault()
  geoFindMe()
})
