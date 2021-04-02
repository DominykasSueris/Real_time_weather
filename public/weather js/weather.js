// OpenWeather Info
const openWeatherKey = '3f64e1c42a739a3badc383a5d7078363';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
//Four Square
const clientId = 'TXBCXL2HJM5OSOOEE1KSWHI2CAU2N3HQL0EF0ORK3REFB5UO';
const clientSecret = 'DTNBUBBJIIALBMJTJSB3FPXJUORV1Y2H5NCWT2WHYW0MILZ1';
const fourthBaseUrl = 'https://api.foursquare.com/v2/venues/explore';
//Weather button
const input = document.getElementById("location-input");
const result = document.getElementById("request-button").addEventListener("click", function(e) {
    e.preventDefault();
    if (locationConfirmation()) {
        weatherDataImport();
        locationsDataImport();
    } else {
        alert("Please, enter correct location");
    }
});


// <--validation
const locationInputResult = document.getElementById("location-input");

function locationConfirmation() {
    if (locationInputResult.value !== "" && isNaN(locationInputResult.value)) {
        return true;
    } else {
        return false;
    }
}


const weatherDataImport = function() {
    const url = new URL(weatherBaseUrl);
    const params = { q: input.value, appid: openWeatherKey };
    url.search = new URLSearchParams(params);
    fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed');
        }, error => console.log("Error"))
        .then(jsonResponse => {
            document.getElementById("weather-temperature").innerHTML = `Temperature: ${kelvinTransformToCelcius(jsonResponse.main.temp)} &#8451`;
            document.getElementById("weather-wind").innerHTML = `Wind speed: ${jsonResponse.wind.speed} m/s`;
            document.getElementById("weather-visibility").innerHTML = `Visibility: ${metersTransformToKillometers(jsonResponse.visibility)} km`;
            let description = jsonResponse.weather[0].description[0].toUpperCase() + jsonResponse.weather[0].description.substring(1);
            document.getElementById("weather-condition").innerHTML = `Condition: ${description}`;
            document.getElementById("city-location").innerHTML = `<span class ="titleUppercase">${input.value.toUpperCase()}</span> current weather`;
            const weatherLogo = document.createElement("img");
            weatherLogo.src = "Content/003-storm.png";
            const weatherLogoImport = document.getElementById("weather-logo");
            weatherLogoImport.innerHTML = '';
            weatherLogoImport.appendChild(weatherLogo);
            document.getElementById("weather-response").classList.remove("hidden-table");
        });
}

//transform to celcius
const kelvinTransformToCelcius = result => (result - 273.15).toFixed(0);

const metersTransformToKillometers = result => (result / 1000).toFixed(0);

const locationsDataImport = function() {
    const url = new URL(fourthBaseUrl);
    const params = { client_id: clientId, client_secret: clientSecret, near: input.value, limit: 3, v: 20210208 };
    url.search = new URLSearchParams(params);
    const recomendedLocations = document.getElementById("locations");
    fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed');
        }, error => console.log("Error"))
        .then(jsonResponse => {
            recomendedLocations.innerHTML = '';
            jsonResponse.response.groups[0].items.forEach(element => {
                const locationName = document.createElement("h2");
                locationName.classList.add("locationName");
                locationName.innerText = element.venue.name;
                const locationAddress = document.createElement("h3");
                locationAddress.classList.add("locationAddress");
                locationAddress.innerText = `Address: ${element.venue.location.address}`;
                locationName.appendChild(locationAddress);
                recomendedLocations.appendChild(locationName);
                // img
                const locationLogo = document.createElement("img");
                locationLogo.classList.add("locationLogo");
                locationLogo.src = "Content/cloudy.png";

                locationName.appendChild(locationLogo);

                document.getElementById("location-response").classList.remove("hidden-table");
            });
        })
}