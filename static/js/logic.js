/*
Directions:
Create a map using Leaflet that plots all of the earthquakes 
from your data set based on their longitude and latitude.
*/

// 1. get url ------------------------------------------------------------

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// 2. load in data and create markers ------------------------------------------------------------


// load in data and create markers
d3.json(url, function(data) {

  // print data to console
  // console.log(data.features)

  // create features
  createMarkers(data.features);

});

// create features
function createMarkers(earthquakeData) {

  // color based on magnitude
  function markerColor(type) {
    switch (true) {
    case type < 1:
      return "#B8FF33";  // green
    case type < 2:
      return "#E0FF33"; // yellow-green
    case type < 3:
      return "#FFDD33";  //yellow
    case type < 4:
      return "#FF9C33";   // orange
    case type < 5:
      return "#FF5733";    // red
    default:
      return "#FF3333";  // dark red
    }
  }

  // create geoJSON layer containing the features array on the earthquakeData object
  var earthquake_markers = L.geoJSON(earthquakeData, {

    // create circles
    pointToLayer:function(feature, latlng){
      return L.circleMarker(latlng);
    },

    // create pop-up
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag);
    },

    // color and size
    style: function(feature) {
      return {
        color: "gray", // outline color
        fillColor: markerColor(feature.properties.mag), // function created above
        fillOpacity: 0.7,   // alpha
        weight: 1,   // weight of outline
        radius: feature.properties.mag * 5  // size based on magnitude
      };
    }

  })

  // send earthquakes layer to createMap function below
  createMap(earthquake_markers);
}


// 3. create the map ------------------------------------------------------------

// this function will create the map with two base layers, the layer of markers (overlay), and the legend
function createMap(earthquake_markers) {

  // streetmap and light map layers
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  // base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap
  };

  // overlay layer
  var overlayMaps = {
    Earthquakes: earthquake_markers
  };

  // create the map with two layers
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquake_markers]  // to display when page loads
  });

  // layer control with baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);  // add these to the map

  // define legend and position
  var legend = L.control( {
    position: "bottomright"
  });

  // add details for legend
  legend.onAdd = function(){
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#B8FF33", "#E0FF33", "#FFDD33", "#FF9C33", "#FF5733", "#FF3333"];
    var grades = [0,1,2,3,4,5];

   var legendInfo = "<h1>Magnitude</h1>";
   div.innerHTML = legendInfo;

   // add the colors and magnitude grades to legend
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<li style=\"background-color: " + colors[i] + "\"></li>" + grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1] +"<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);  // add legend to map


}