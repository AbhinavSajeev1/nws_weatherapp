let count = 0; 
let globalurl = ""
let globalData = null; 
let globalLocation = null;
let savedPosition = null; 

window.onload = function() { 
    document.getElementById('button').onclick = function() {
    getLocation(); 

    if (!document.getElementById("weather-container")) {
        const weatherBox = document.createElement('div');
        weatherBox.id = ("weather-container")
        weatherBox.classList.add("weather-box");
           
        weatherBox.innerHTML = `
            <h3 id="city-state">Loading...</h3>
            <span id="state"></span>
            <div id="temp"></div>
            <div id="forecast"></div>
            <div id="date"></div>
        
        `
        const wrapper = document.getElementById("weather-wrapper");
        wrapper.appendChild(weatherBox);

        const weatherArrow = document.createElement("button");
        weatherArrow.textContent = ">>";
        weatherArrow.id = "next_button"
        const button_wrapper = document.getElementById('button_wrapper');
        weatherArrow.classList.add("button_wrapper");
        button_wrapper.appendChild(weatherArrow);

        const leftWeatherArrow = document.createElement("button");
        leftWeatherArrow.textContent = "<<";
        leftWeatherArrow.id = "last_button";
        const left_button_wrapper = document.getElementById("left_button_wrapper");
        leftWeatherArrow.classList.add("left_button_wrapper");
        left_button_wrapper.appendChild(leftWeatherArrow);

    }

    document.getElementById('next_button').onclick = function() {
        console.log("clicked");
        count ++;
        longLat();
    }

    document.getElementById('last_button').onclick = function() {
        if (count > 0) {
            console.log("back clicked");
            --count; 
            longLat();
        }
    }
}
    

};

function updateWeather(weather) {
    if (weather) {
        document.getElementById('temp').innerHTML = weather.temperature + "° " + weather.temperatureUnit
        document.getElementById('forecast').innerHTML = weather.shortForecast 
        document.getElementById('date').innerHTML = weather.name
    }
}


function getLocation() {
    if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(longLat);} 
    else {
        console.log("error!")
    }
    
}
          
function getElement(id) {
    return document.getElementById(id);
} 

async function longLat(position) { 

    if (position) {
        savedPosition = position;
    }

    if (globalData != null) {
        document.getElementById('city-state').innerHTML = globalLocation;
        updateWeather(globalData[count]);
        return;
        
    }

    const lat = savedPosition.coords.latitude
    const lon = savedPosition.coords.longitude
    const url =  `https://api.weather.gov/points/${lat},${lon}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            globalLocation = "Weather in " + data.properties.relativeLocation.properties.city + ", " + data.properties.relativeLocation.properties.state;
            document.getElementById('city-state').innerHTML = globalLocation;
            return fetch (data.properties.forecast)
        })
        .then(res => res.json())
        .then(forecastData => {
            globalData = forecastData.properties.periods;
            updateWeather(globalData[count])
        })
        .catch(error => console.error('Error:', error));


}

