/* ----------변수 설정---------- */
let searchBox = document.querySelector("#search");
let titleText = document.querySelector(".title");
let searchList = document.querySelector(".search-list");
let appBox = document.querySelector("#app");

/* ----------필터 함수---------- */
function filter() {
  if (Boolean(searchBox.value) == true) {
    searchList.classList.add("active");
    titleText.classList.add("active");
  } else {
    searchList.classList.remove("active");
    titleText.classList.remove("active");
  }
  /* ----------검색 기능---------- */
  let btns = document.querySelectorAll(".search-list button");
  btns.forEach((e, index) => {
    if (e.innerHTML.includes(searchBox.value)) {
      e.style.display = "block";
    } else {
      e.style.display = "none";
    }
    e.addEventListener("click", () => {
      searchList.classList.remove("active");
      titleText.classList.remove("active");
      searchBox.value = "";
    });
  });
}

/* ----------정보 불러오기---------- */
fetch("src/city.json")
  .then((res) => res.json())
  .then((data) => {
    let cityArr = data.cityKo;
    let cityArrEn = data.cityEn;
    /* 버튼 요소 추가 */
    for (let i = 0; i < cityArr.length; i++) {
      let btnEl = document.createElement("button");
      btnEl.innerText = `${cityArr[i]}`;
      btnEl.classList.add(`${cityArrEn[i]}`);
      searchList.append(btnEl);
    }
    /* 필터 함수 실행 */
    filter();

    const API_KEY = "b68177078f5cb7c53e861421586aee13";
    /* ----------geolocatio---------- */

    function geoOk(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      let myLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      // console.log(myLocation);
      fetch(myLocation)
        .then((res) => res.json())
        .then((data) => {
          let arrN = cityArrEn.indexOf(data.name);
          document
            .querySelector("#app div:nth-child(3)")
            .classList.add(data.name);
          document.querySelector(".my-local-name").innerHTML = cityArr[arrN];
          document.querySelector(".my-weather-main").innerHTML =
            data.weather[0].main;
          document.querySelector(".my-local-temp").innerHTML = `${(
            data.main.temp - 273.15
          ).toFixed(2)}&deg;`;
          document.querySelector(".my-local-temp-max").innerHTML = `최고:${(
            data.main.temp_max - 273.15
          ).toFixed(2)}&deg;`;
          document.querySelector(".my-local-temp-min").innerHTML = `최저:${(
            data.main.temp_min - 273.15
          ).toFixed(2)}&deg;`;
          document.querySelector(
            "#app div:nth-child(3)"
          ).style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(./src/images/${data.weather[0].main}.gif)`;
          document.querySelector(
            ".arrow i"
          ).style.transform = `rotate(${data.wind.deg}deg)`;
          document.querySelector(
            ".wind-speed"
          ).innerHTML = `풍속 : ${data.wind.speed}m/s`;
          document.querySelector(
            ".humidity"
          ).innerHTML = `습도 : ${data.main.humidity}%`;
        });
    }
    function geoNg() {
      alert("I can't find you. No weather for you.");
    }
    navigator.geolocation.getCurrentPosition(geoOk, geoNg);

    /* ----------WeatherAPI---------- */
    let btns = document.querySelectorAll(".search-list button");
    btns.forEach((e) => {
      e.addEventListener("click", () => {
        let city = e.className;
        let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        console.log(API_URL);
        fetch(API_URL)
          .then((res) => res.json())
          .then((data) => {
            let addWeatherBox = document.createElement("div");
            addWeatherBox.classList.add(e.className, "addbox");
            let arrN = cityArrEn.indexOf(data.name);
            addWeatherBox.innerHTML = `
            <div>
              <p>${cityArr[arrN]}</p>
              <p class="small-text">${data.weather[0].main}</p>
            </div>
            <div>
              <p>${(data.main.temp - 273.15).toFixed(2)}&deg;</p>
              <p class="small-text">
                <span>최고:${(data.main.temp_max - 273.15).toFixed(
                  2
                )}&deg;</span>
                <span>최저:${(data.main.temp_min - 273.15).toFixed(
                  2
                )}&deg;</span>
              </p>
            </div>
            <div class="hide">
              <div class="wind">
                  <div class="arrow">
                    <i style="transform:rotate(${
                      data.wind.deg
                    }deg);" class="fa-solid fa-arrow-up"></i>
                  </div>
                  <p class="wind-speed" style="font-size:18px;">
                    풍속 : ${data.wind.speed}m/s
                  </p>
              </div>
              <div class="humidity">
              습도 : ${data.main.humidity}%
              </div>
            </div>
            `;
            addWeatherBox.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(./src/images/${data.weather[0].main}.gif)`;
            appBox.append(addWeatherBox);
            setTimeout(function () {
              addWeatherBox.classList.add("ani");
            }, 30);
            Big();
          });
        Big();
      });
    });
  });

/* 이미지 키우기 */
let myLocalActive = document.querySelector("#app div:nth-child(3)");
myLocalActive.addEventListener("click", (e) => {
  myLocalActive.classList.toggle("active");
});

/*  */
function Big() {
  let addBox = document.querySelectorAll(".addbox");
  addBox.forEach((e) => {
    e.addEventListener("click", () => {
      e.classList.toggle("active");
    });
  });
}
