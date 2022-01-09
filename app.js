const weatherElementsFromDOM = () => {
  const temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const temperatureDegree = document.querySelector(".temperature-degree");
  const locationTimezone = document.querySelector(".location-timezone");
  const temperatureSection = document.querySelector(".temperature");
  const temperatureSpan = document.querySelector(".temperature span");
  return {
    tempDescription: temperatureDescription,
    tempDegree: temperatureDegree,
    location: locationTimezone,
    tempSection: temperatureSection,
    tempSpan: temperatureSpan,
  };
};

const setWeather = (data) => {
  const { temp, loc, description } = extractWeatherData(data);
  const { tempDescription, tempDegree, location, tempSection, tempSpan } =
    weatherElementsFromDOM();
  updateWeatherInfo(
    [tempDegree, tempDescription, location],
    [temp, description, loc]
  );
};
const updateWeatherInfo = (weatherInfo, data) => {
  weatherInfo.map((elem, index) => setElementText(elem, data[index]));
};

const setElementText = (element, text) => (element.textContent = text);

const coordAPICall = (lat, long) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=6bd7ee9ffe2d64cf0fa1a487d4946163`;

const extractWeatherData = (data) => {
  return {
    temp: data.main.temp,
    loc: data.name,
    main: data.weather[0].main,
    description: data.weather[0].description,
  };
};

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      const api = coordAPICall(
        position.coords.latitude,
        position.coords.longitude
      );
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setWeather(data);

          const { main, temp } = extractWeatherData(data);
          setIcon(main, document.querySelector(".icon"));

          const { tempSection, tempSpan, tempDegree } =
            weatherElementsFromDOM();

          tempSection.addEventListener("click", () => {
            const toCelsius = (farenheight) => (farenheight - 32) * (5 / 9);
            if (tempSpan.textContent === "F") {
              tempSpan.textContent = "C";
              tempDegree.textContent = Math.floor(toCelsius(temp));
            } else {
              tempSpan.textContent = "F";
              tempDegree.textContent = temp;
            }
          });
        });
    });
  }

  const weatherToSkycon = new Map([
    ["Thunderstorm", "RAIN"],
    ["Drizzle", "RAIN"],
    ["Rain", "RAIN"],
    ["Snow", "SNOW"],
    ["Fog", "FOG"],
    ["Squall", "WIND"],
    ["Clouds", "CLOUDY"],
    ["Clear", "CLEAR_DAY"],
  ]);

  function setIcon(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = weatherToSkycon.get(icon);
    console.log(currentIcon);
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
