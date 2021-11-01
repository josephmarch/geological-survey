// Geojson for significant earthquakes in the past month
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//Function for creating the map
function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map
    var street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Create a baseMaps object to hold the street map
    var baseMaps = {
      "Street Map": street
    };
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
    // Create the map object with options
    var myMap = L.map("map", {
      center: [0, 0],
      zoomsnap: .25,
      zoom: 2.75,
      worldCopyJump: true,
      layers: [street, earthquakes]
    });
    // Create a layer control, and pass it baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

//Function to create the earthquake markers
function createMarkers(response) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describs the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Create a GeoJSON layer, and add it to the map using the onEachFeature function once fore each piece of data.
    var earthquakes = L.geoJSON(response, {
        onEachFeature: onEachFeature
    });
    // Pass the earthquake data to a createMap() function.
    createMap(earthquakes);
}

// Get the data with d3.
d3.json(url).then(function(response) {
    console.log(response);
    createMarkers(response);
});