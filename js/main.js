let count = 0;
let globalData = null;
let globalLocation = null;
let savedPosition = null;

const button = document.getElementById("button");
const weatherWrapper = document.getElementById("weather-wrapper");
const previousButton = document.getElementById("last_button");
const nextButton = document.getElementById("next_button");

button.addEventListener("click", getLocation);
previousButton.addEventListener("click", () => {
    if (count > 0) {
        count -= 1;
        renderForecast();
    }
});
nextButton.addEventListener("click", () => {
    if (globalData && count < globalData.length - 1) {
        count += 1;
        renderForecast();
    }
});

function getLocation() {
    if (!navigator.geolocation) {
        showError("Location services are not supported by this browser.");
        return;
    }

    button.disabled = true;
    button.querySelector("span:nth-child(2)").textContent = "Finding your forecast...";
    navigator.geolocation.getCurrentPosition(loadForecast, () => {
        showError("We couldn’t access your location. Please allow location access and try again.");
    });
}

async function loadForecast(position) {
    savedPosition = position;
    count = 0;
    setLoadingState();

    try {
        const { latitude, longitude } = savedPosition.coords;
        const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
        if (!response.ok) throw new Error("Unable to find forecast location");
        const data = await response.json();
        const location = data.properties.relativeLocation.properties;
        globalLocation = `${location.city}, ${location.state}`;

        const forecastResponse = await fetch(data.properties.forecast);
        if (!forecastResponse.ok) throw new Error("Unable to load forecast");
        const forecastData = await forecastResponse.json();
        globalData = forecastData.properties.periods;
        renderForecast();
    } catch (error) {
        showError("We couldn’t load the forecast right now. Please try again.");
        console.error("Forecast error:", error);
    } finally {
        button.disabled = false;
        button.querySelector("span:nth-child(2)").textContent = "Refresh my forecast";
    }
}

function renderForecast() {
    const weather = globalData[count];
    weatherWrapper.innerHTML = `
        <article class="weather-box">
            <div class="weather-box__topline">
                <span class="weather-box__location">⌖ ${globalLocation}</span>
                <span class="weather-box__period">${weather.name}</span>
            </div>
            <div class="weather-box__main">
                <div class="weather-box__icon">${getWeatherIcon(weather.shortForecast)}</div>
                <div>
                    <div class="temperature">${weather.temperature}<sup>°${weather.temperatureUnit}</sup></div>
                    <p class="forecast">${weather.shortForecast}</p>
                </div>
            </div>
            <div class="weather-box__details">
                <div><span>WIND</span><strong>${weather.windSpeed}</strong><small>${weather.windDirection}</small></div>
                <div><span>OUTLOOK</span><strong>${weather.detailedForecast}</strong></div>
            </div>
        </article>
    `;
    previousButton.disabled = count === 0;
    nextButton.disabled = count === globalData.length - 1;
}

function setLoadingState() {
    weatherWrapper.innerHTML = `<div class="empty-state loading-state"><div class="loader"></div><p>Reading the sky...</p><span>Finding your local conditions</span></div>`;
}

function showError(message) {
    weatherWrapper.innerHTML = `<div class="empty-state error-state"><div class="empty-state__icon">!</div><p>${message}</p><span>Check your browser permissions and try again.</span></div>`;
    previousButton.disabled = true;
    nextButton.disabled = true;
}

function getWeatherIcon(forecast) {
    const value = forecast.toLowerCase();
    if (value.includes("thunder")) return "ϟ";
    if (value.includes("rain") || value.includes("shower")) return "☂";
    if (value.includes("snow")) return "❄";
    if (value.includes("cloud")) return "☁";
    return "☼";
}
