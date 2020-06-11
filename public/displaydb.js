//making a map and tiles
const mymap = L.map('issmap').setView([0,0], 1);
//var: lat, long, zoom length
const attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(mymap);

getData();
async function getData(){
  /*Here, we are making an API that handles a get request.
    Notice: this /api route cannot be found, if we do not have a response
    in the server that handles it!*/
  const response = await fetch('/api');
  const data = await response.json();
  //make a for loop of DOM elements to display each row in the db!
  //data is an array of objects. each array item is a separate row in the database
  let firstTime = true;
  for(item of data){
    //making a marker (pin) with a custom icon
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = document.createElement('p');
    txt.textContent = `The weather here, in ${item.weather.name}, (lat: ${item.lat.toFixed(2)}, lon: ${item.lon.toFixed(2)}), is ${item.weather.weather[0].description} with a temperature of
      ${(item.weather.main.temp*9/5-459.67).toFixed(2)}˚F. `;

    if (item.air_quality.value<0){
       txt.textContent += 'Air quality not available :)';
    } else {
      txt.textContent += `The concentration of particulate matter (${item.air_quality.parameter}) is
        ${item.air_quality.value} ${item.air_quality.unit}, last updated on ${item.air_quality.lastUpdated}`;
    }

    marker.bindPopup(txt);
  }

  console.log(data);
}
