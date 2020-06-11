  let lat, lon, weather, air_quality;
  const button = document.getElementById('submit');
  button.addEventListener('click', async event => {
  /*good exercise: leaflet map from past project to show user where they are located*/
    const data = {lat, lon, weather, air_quality};
    /*send data to server  */
    const options = {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
      };
      const dbresponse = await fetch('/api', options);
      const dbjson = await dbresponse.json();
      console.log('client said ');
      console.log(dbjson);

  });


  if('geolocation' in navigator) {
    /* geolocation is available */
    console.log('geo available');
    navigator.geolocation.getCurrentPosition(async position => {
  //    let lat, lon, weather, air_quality;
      try {
    /*good exercise: leaflet map from past project to show user where they are located*/
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(lat, lon);
     document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);

      const weather_url = `weather/${lat},${lon}`;
      const response = await fetch(weather_url);
      const json = await response.json();
      console.log('JSON OF WEATHER API GONNA READ');
      console.log(json);

      weather = json.weatherdata;
      document.getElementById('summary').textContent = weather.weather[0].description;
      //temp is by default, in kelvins. To convert to F: iK*9/5 - 459.67
      let fval = json.weatherdata.main.temp*9/5-459.67;
      document.getElementById('temperature').textContent= fval.toFixed(2);
      document.getElementById('location').textContent = weather.name;

      air_quality = json.airquality.results[0].measurements[0];
      document.getElementById('aqparam').textContent = air_quality.parameter;
      document.getElementById('aqvalue').textContent = air_quality.value;
      document.getElementById('aqunits').textContent =air_quality.unit;
      document.getElementById('aqdate').textContent =air_quality.lastUpdated;

      } catch (error) {
        console.log('something went wrong! :( grr.');
        console.error('here :( --> ' , error);
        document.getElementById('aqvalue').textContent = 'NO READING! :(((';
        air_quality = {value: -1};
}
  /* post request above turns data object into a json string to fit post request body. */
  });

  }
   else {
    /* geolocation IS NOT available */
    console.log('geo NOT available');
  }
