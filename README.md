# Skycast

Skycast is a small browser-based weather dashboard powered by the [National Weather Service API](https://www.weather.gov/documentation/services-web-api).

## Features

- Uses the browser's location permission to load the local NWS forecast.
- Shows forecast periods with temperature, conditions, wind, and a detailed outlook.
- Checks the NWS active alerts endpoint for the selected location.
- Displays active hurricane, tropical storm, tropical depression, storm surge, and tropical cyclone alerts.
- Keeps the interface intentionally simple, with a clear message when no hurricane alerts are active.

## Run locally

This is a static site. Serve the repository with any local web server, then open `index.html` in a browser. Location access generally requires `localhost` or HTTPS.

For example:

```bash
python -m http.server
```

Click **Use my location** to load the forecast and live hurricane alerts. The alert panel uses:

```text
https://api.weather.gov/alerts/active?point={latitude},{longitude}
```

Forecast and alert data are live responses from the NWS API and can be unavailable during an API or network outage.
