window.addEventListener("load", () => {
  let long, lat;
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  const temperatureSection = document.querySelector(".temperature");
  const temperatureSpan = document.querySelector(".temperature span");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=6bd7ee9ffe2d64cf0fa1a487d4946163`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const { temp } = data.main;
          const location = data.name;
          const { main, description } = data.weather[0];
          temperatureDegree.textContent = temp;
          temperatureDescription.textContent = description;
          locationTimezone.textContent = location;

          setIcons(main, document.querySelector(".icon"));

          temperatureSection.addEventListener("click", () => {
            const toCelsius = (farenheight) => (farenheight - 32) * (5 / 9);
            if(temperatureSpan.textContent === 'F'){
              temperatureSpan.textContent = 'C';
              temperatureDegree.textContent = Math.floor(toCelsius(temp));
            }
            else{
              temperatureSpan.textContent = 'F';
              temperatureDegree.textContent = temp;
            }
          });
        });
    });
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = toSkycon(icon);
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }

  function toSkycon(weather) {
    switch (weather) {
      case "Thunderstorm":
      case "Drizzle":
      case "Rain":
        return "RAIN";
      case "Snow":
        return "SNOW";
      case "Fog":
        return "FOG";
      case "Squall":
        return "WIND";
      case "Clouds":
        return "CLOUDY";
      default:
        return "CLEAR_DAY";
    }
  }
});
