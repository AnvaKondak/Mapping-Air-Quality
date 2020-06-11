const express = require('express')
const Datastore = require('nedb') //node package nedb comes in as a big function
const fetch = require('node-fetch')
require('dotenv').config();
console.log(process.env);
const app = express(); //while node package express comes in as a big function that i can execute and put in a variable
app.listen(3000, ()=> console.log('listening at port 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => { //empty {} for full database
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  console.log('i got a request');
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp; //added 2 new variables to data object to return as response and add to database
  database.insert(data);

  response.json(data);
});


app.get('/weather/:latlon', async (request, response) => {
  /*wanna make a new endpoint in my server that receives the latitude and longitude */
console.log('request params: ');
  console.log(request.params);
  const latlon = request.params.latlon.split(',');  //array of values split by ','
  const lat = latlon[0];
  const lon = latlon[1];
  console.log('server here, lat lon are:');
  console.log(lat, lon);


   /*had to install node-fetch before being able to use fetch in the server*/
  //const api_key = '0fd4d8a83b1707a46353c5aece9454bb';
  const api_key = process.env.API_KEY;
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();


  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aqresponse = await fetch(aq_url);
  const aqdata = await aqresponse.json();
  console.log('aq url results: ');
  console.log(aqdata);

  const data = {
    weatherdata: weather_data,
    airquality: aqdata
  }
  response.json(data); //make api call from within here and then send it back
  //proxy server: server is proxy for dark sky . net.
});
