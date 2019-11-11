var marker1 = {};

window.onload = function(){
	loadData();
	
}

//loadData does not take any arguments. It gets weather data from the darksky api. This key only allows us
//1000 class per day.
function loadData(){
	///*************************************************************** */
	//apiUrl FIELD HERE> ENTER YOUR API URL WHERE IT SAYS NULL.
	///************************************************************** */
	//var url = null;
	var apiUrl = null;
	if (apiUrl == null){
		alert("Go to mapScripts.js and enter your darkSkys API url into the apiUrl field to load map. url must end in a backslash (/)");
	}
	var url = document.getElementById('latitudeInput').value +","+ document.getElementById('longitudeInput').value;
	url = apiUrl+url;
	$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
		makeMap(data);
	})
}

//makeMape takes one argument, data, and creates the map object as well as puts a marker onto it.
function makeMap(data){
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	mymap.setMaxBounds([[36.7094, -110.2259],[41.1586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in

	
	// different icons for the different weather types
	// todo: fix the icons covering the city names
	
	var sunnyIcon = L.icon({
		iconUrl:'img/sunny.png',

		iconSize: [40, 40]
	});

	var cloudyIcon = L.icon({ // TODO: find new image
		iconUrl:'img/cloudy.png',

		iconSize: [40, 40]
	});

	var rainyIcon = L.icon({
		iconUrl:'img/rain.png',

		iconSize: [40, 40]
	});

	var snowyIcon = L.icon({ // TODO: find new image
		iconUrl:'img/snow.png',

		iconSize: [40, 40]
	});

	var stormIcon = L.icon({
		iconUrl:'img/thunderstorm.png',

		iconSize: [40, 40]
	});

	var alertIcon = L.icon({ // TODO: find new image
		iconUrl:'img/alert.png',

		iconSize: [40, 40]
	});

	var redAlertIcon = L.icon({ //
		iconUrl:'img/redalert.png',

		iconSize: [40, 40]
	});

	//making marker update based on lat/lng inputs
	 marker1 = L.marker([document.getElementById('latitudeInput').value,document.getElementById('longitudeInput').value], {icon: redAlertIcon}).addTo(mymap);

	
	marker1.bindPopup('<h3>Weather info for (cityname)</h3>' 
					+ '<p>Entered latitude and longitude: '+ document.getElementById('latitudeInput').value +" "+ document.getElementById('longitudeInput').value +'</p>'
					+ '<div class="card bg-light">'
					+ '<ul class="list-group">'
					+ 	"<li class = list-group-item>Current Temperature: " +data.currently.temperature+" </li>"
					+	'<li class = list-group-item>Current Weather: '+  data.currently.summary+' </li>'
					+ 	"<li class = list-group-item>Conditions: "+data.daily.summary+" </li>"
					+ '</ul>'
					+ '</div>');
	
}

//addMarker takes no arguments and adds a marker based off of the input in the latitude and longitude fielsa
//on the main page.
//THIS FUNCTION IS CURRENTLY NOT BEING USED.
//This allows us to add more then one maker at a time, but for now I have it just move one marker around
//the page.
function addMarker(){
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	marker1 = L.marker([document.getElementById('latitudeInput').value,document.getElementById('longitudeInput').value]).addTo(mymap);  
}