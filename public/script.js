
const searchElement = document.querySelector('[data-city-search]');
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', ()=>{
    const place = searchBox.getPlaces()[0];
    if (place == null) {return};
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    }).then(res => res.json()).then(data=>{
        const dateObj = new Date();
        const date = dateObj.toLocaleString();
        setWeatherData(data, place.formatted_address, date);
    }).catch((error) => console.error(error));
})

const locationElement = document.querySelector('[data-location]');
const descriptionElement = document.querySelector('[data-description]');
const temperatureElement = document.querySelector('[data-temperature]');
const humidityElement = document.querySelector('[data-humidity]');
const windElement = document.querySelector('[data-wind]');
const dateElement = document.querySelector('[data-date]');

const icon = new Skycons({"color": "black"});
//default
icon.set('icon', Skycons.CLEAR_DAY);
icon.play();

//https://openweathermap.org/weather-conditions
//https://darkskyapp.github.io/skycons/
//map main values of openweather to a darksky icon
const dayIcons = {
    "clear":"CLEAR_DAY",
    "clouds":"PARTLY_CLOUDY_DAY",
    "drizzle":"RAIN",
    "rain":"RAIN",
    "thunderstorm":"RAIN",
    "snow":"SNOW",
    "mist":"FOG",
    "haze":"FOG",
    "smoke":"FOG",
    "dust":"FOG",
    "fog":"FOG",
    "sand":"FOG",
    "ash":"FOG",
    "squall":"WIND",
    "tornado":"WIND"
}
const nightIcons = {
    "clear":"CLEAR_NIGHT",
    "clouds":"PARTLY_CLOUDY_NIGHT",
    "drizzle":"RAIN",
    "rain":"RAIN",
    "thunderstorm":"RAIN",
    "snow":"SNOW",
    "mist":"FOG",
    "smoke":"FOG",
    "haze":"FOG",
    "dust":"FOG",
    "fog":"FOG",
    "sand":"FOG",
    "ash":"FOG",
    "squall":"WIND",
    "tornado":"WIND"
}

function findIconName(description, timeOfDay){
    if (timeOfDay == "PM"){
        return dayIcons[description] || "CLOUDY";
    }
    else if(timeOfDay == "AM"){
        return  nightIcons[description] || "CLOUDY";
    }
    return "CLOUDY";
}

function setWeatherData(data, place, date){
    locationElement.textContent = place;
    //captilize first letter of each word in description
    descriptionElement.textContent = data.weather[0].description.toLowerCase()
        .split(' ')
        .map(word=>word.charAt(0).toUpperCase() + word.substring(1))
        .join(' ');
    temperatureElement.textContent = parseInt((data.main.temp-273.15)*(9/5)+32)+'°F';
    humidityElement.textContent = data.main.humidity + '%';
    windElement.textContent = parseInt(data.wind.speed*2.237) + ' mph';
    dateElement.textContent = date;

    const timeOfDay = date.slice(-2);
    const iconName = findIconName(data.weather[0].main.toLowerCase(), timeOfDay);
    icon.set('icon', Skycons[iconName]);
    icon.play();
}

