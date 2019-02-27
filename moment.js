
$(document).ready(function() {
    //load the functions once the page open/loading
    $(".cityarea").html(getLocation);
    CitiesMenu();
    date();
    startClock();
    
  });
   // Creating variables for Country, City, Region, longitude, latitude, APPID, API-Url
    var currentLat;
    var currentLong;
    var currentCity;
    var currentRegion;
    var currentCountry;
    var APIKey = '***********YOUR API-KEY HERE********'; // YOU MOST USE YOUR OWN API-KEY IN THE APPLICATION, ELSE SHOULD NOT WORK !
    var URL = 'https://api.openweathermap.org/data/2.5/weather?'; // Sending request to open weather API
  
  // info for the Enonic offices in those cities:
    var mainCities = {
      'Oslo': {
        'region': 'Oslo',
        'country': "Norway",
        'lat': 59.9127,
        'lon': 10.7461
      },
      'London': {
        'region': 'London',
        'country': "United Kingdom",
        'lat': 51.51,
        'lon': -0.13
      },
      'Minsk': {
        'region': 'Minsk',
        'country': "Belarus",
        'lat': 53.9,
        'lon': 27.56
      }
    };
    
  // Add the cities from mainCities to the blue dropdown button
    function CitiesMenu() {
      for (var place in mainCities) {
        var city = place.replace(/_/g, '');
        $('#CitiesMenu').append("<li onclick=CitiesLocationWeather('" + place + "');><a href='#'>" + city + "</a></li>");
      }
    };
    
  //Every click from the cities in the dropdown button call this function. cityLocation get the city from mainCities
    function CitiesLocationWeather(cityLocation) {
      currentLat = mainCities[cityLocation].lat;
      currentLong = mainCities[cityLocation].lon;
      currentRegion = mainCities[cityLocation].region;
      currentCity = cityLocation.replace(/_/g, ' ');
      currentCountry = mainCities[cityLocation].country;
      
      //call the function getWeather and apply the data above to this function
      getWeather();  
    };
    
  //find the current location anywhere by the computer's ip address
  //use https://ipapi.co/ to find user location
    function getLocation() {
      $.getJSON('https://ipapi.co/json', function(data) {
        currentRegion = data.region;
        currentCountry = data.country;
        currentLat = data.latitude;
        currentLong = data.longitude;
        
        //call the function getWeather and apply the data above to this function
        getWeather();
      });
    };
    
  //very important function. It collect latitude and longitude of the current location or main city and use it to get the local weather from api Open Weather app. 
  // It also have other stuff such as converting between F and C. 
  function getWeather() {
    // View the city & country in HTML-fil by calling Id
    $("#state").text(currentRegion +", ");
    $("#country").text(currentCountry);
    
    //Geting weather data from https://api.openweathermap.org/data/2.5/weather? by JOSN-format
    $.getJSON( URL + 'lat=' + currentLat + '&lon=' + currentLong + '&units=metric&APPID=' + APIKey , function(WeatherData) {
      // Get city name form API
      $("#cityname").text(WeatherData.name);
      // Present temperature with Celsius characters
      var ShowCelius = true;
      var temcelcius = Math.round(WeatherData.main.temp); // convert to Celsius numbers/temperature
      var tempfahrenheit = Math.round((temcelcius * 9/5) + 32); // convert to fahrenheit temperature

      // Switch between Celsius and Fahrenheit temperature
      // by default, Celsius is selected
      $("#temp").html(temcelcius);
      $('#unit-switch').off('click');
      $('#unit-switch').on('click', function() {
        if (ShowCelius === false) {
        $("#temp").html(temcelcius);
        ShowCelius = true;
        } else {
            $("#temp").html(tempfahrenheit); 
            ShowCelius = false;
        }
        $("#unit-toggle").toggleClass("toggle");       
      });
      
      // Show weather icon
      var prefix = "wi wi-owm-";
      var weatherIcons = WeatherData.weather[0].id;
      var icon = prefix + weatherIcons;
      $("#wparameter").html("<i class='" + icon + "'></i>");  
      $("#wdescription").text(WeatherData.weather[0].description);
    });
  };
  
  // Function to display date with special format (dd.mm.yyyy)
  function date(){
    var d = new Date();
    var date = d.getDate();
    var year = d.getFullYear();
    var month = d.getMonth();
    var monthArray = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    month = monthArray[month];
    document.getElementById("timer").innerHTML= date +". "+month+". "+year + "  ";
} 

  // Function to display courent lcation time.
  function startClock(){
    setInterval(function(){
      $("#localTime").text(new Date().toLocaleTimeString());
    }, 1000);
  }

// Function to Refresh weather and page
$("#refreshButton").on("click", function(){
  // Starts Refresh button's spinning animation
  $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
  getWeather();
});

