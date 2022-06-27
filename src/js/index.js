import '../scss/style.scss'

function getData(link) {
  fetch(link)
    .then(res => res.json())
    .then(res => {
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
  let weatherWeek = document.querySelectorAll('.weather__week');
  let minDegrees = document.querySelectorAll('.min');
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun', 'Mon'];

  for(let i = 0; i < weeks.length; i++) {
    weatherWeek[i].innerHTML = weeks[i]
  }

  console.log(api.daily)
  document.querySelector('.coords').innerHTML = `H:${Math.round(api.lat)}&deg L:${Math.round(api.lon)}&deg`

  const arr = [];
  api.daily.forEach(day => {

    arr.push(Math.floor(day.temp.min))
  })
  for(let i = 0; i < arr.length; i++) {
    minDegrees[i].innerHTML = arr[i]
  }

}



function createList() {
  const ul = document.querySelector('.weather__list');

  for (let i = 0; i < 8; i++) {
      const li = document.createElement('li');
      li.classList.add('weather__item');
      li.innerHTML = `
      <div class="weather__weeks">
        <div class="weather__week"></div>
        <div class="icon"></div>
      </div>
      <div class="weather__graphOfDegrees">
        <div class="weather__graphOfDegrees_degree min"></div>
        <div class="weather__graph"><img src="src/img/Rectangle.svg" alt="graph"></div>
      <div class="weather__graphOfDegrees_degree max">18°</div>
  </div>
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
