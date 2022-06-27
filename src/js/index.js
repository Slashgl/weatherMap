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

      myLocationLink.href = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

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
  document.querySelectorAll('.city').forEach(el => el.innerHTML = api.city.name);
  document.querySelectorAll('.coords').forEach(el => el.innerHTML = `H:${Math.round(api.city.coord.lat)}&deg L:${Math.round(api.city.coord.lon)}&deg`);
  document.querySelector('.time').innerHTML = `${new Date().toLocaleTimeString('ru-RU', {})}`
  api.list.map(weatherInfo => {
    console.log(weatherInfo)
    document.querySelectorAll('.min').forEach(el => el.innerHTML = `${weatherInfo.main.temp_min}`)
  })
}

function createList() {
  const ul = document.querySelector('.weather__list');

  for(let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    li.classList.add('weather__item');

    li.innerHTML = `
      <div class="weather__weeks">
        <div class="weather__week">Mon</div>
        <div class="icon"></div>
       </div>
      <div class="weather__graphOfDegrees">
        <div class="weather__graphOfDegrees_degree min">18°</div>
        <div class="weather__graph"><img src="src/img/Rectangle.svg" alt="graph"></div>
        <div class="weather__graphOfDegrees_degree max">18°</div>
      </div>
    `

    ul.appendChild(li);
    console.log(ul)
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
