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
    // Create a custom legend

    colorlist = ["yellow", "greenyellow", "green", "darkgreen", "darkslategrey"];
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(myMap){
        var div = L.DomUtil.create("div", "info legend"),
        labels = ["<strong>Depths</strong>"],
        categories = ["Depth < 10", "Depth 11-30", "Depth 31-50", "Depth 51-100", "Depth > 100"];
        for(var i = 0; i< categories.length; i++) {
            div.innerHTML +=
                "<i class='circle' style='background:" + colorlist[i] + "'><strong>" + categories[i] +"</strong></i> ";
        }
        return div;
    };
    legend.addTo(myMap);
}

//Function to create the earthquake markers
function createMarkers(response) {   
    // Function to change json markers to circle markers
    function createCircleMarker(feature, latlng ){
        earthquakeColor = "yellow";
        if(feature.geometry.coordinates[2] < 11) {earthquakeColor = "yellow";}
        else if (feature.geometry.coordinates[2] < 31) {earthquakeColor = "greenyellow";}
        else if (feature.geometry.coordinates[2] < 51) {earthquakeColor = "green";}
        else if (feature.geometry.coordinates[2] < 101) {earthquakeColor = "darkgreen";}
        else {earthquakeColor = "darkslategrey";}
        let options = {
            radius: (feature.properties.mag * 2),
            fillColor: earthquakeColor,
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: .75
        }
        return L.circleMarker( latlng, options);
        //
    }

    // Function we run once for each feature in the features array to give them popups
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    
    // Create a GeoJSON layer, and add it to the map using the onEachFeature function once fore each piece of data.
    var earthquakes = L.geoJSON(response, {
        pointToLayer: createCircleMarker,
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