
if(window.location.pathname == '/'){
	window.location.pathname = '/home';
}

function getIcons(){
	var icons = [];

	icons[0] = L.icon({
		iconUrl:'../img/sunny.png',

		iconSize: [30, 30],
		iconAnchor: [15, 30]
	});

	icons[1] = L.icon({
		iconUrl: '../img/clearnight.png',

		iconSize: [30, 30],
		iconAnchor: [15,30]
	});

	icons[2] = L.icon({ // TODO: find new image
		iconUrl:'../img/cloudy.png',

		iconSize: [30, 30],
		iconAnchor: [22, 40]
	});

	icons[3]= L.icon({
		iconUrl:'../img/rain.png',

		iconSize: [30, 30],
		iconAnchor: [15, 30]
	});

	icons[4] = L.icon({ // TODO: find new image
		iconUrl:'../img/snow.png',

		iconSize: [30, 30],
		iconAnchor: [15, 35]
	});

	icons[5] = L.icon({
		iconUrl:'../img/thunderstorm.png',

		iconSize: [30, 30],
		iconAnchor: [15, 28]
	});

	icons[6] = L.icon({ // TODO: find new image
		iconUrl:'../img/alert.png',

		iconSize: [30, 30],
		iconAnchor: [22, 40]
	});

	icons[7] = L.icon({ //
		iconUrl:'../img/redalert.png',

		iconSize: [20, 20],
		iconAnchor: [10, 5]
	});
	return icons;
}

function loadData(lat, long, locations){
	///*************************************************************** */
	//apiUrl FIELD HERE> ENTER YOUR API URL IN KEY.JS FILE.
	///************************************************************** */
	//var url = null;
	//console.log(locations);
	var icons = getIcons();
	var weather_data = [];
	var lats = [];
	var longs = [];
	var cities = [];
	var urls = [];
	var apiUrl = darkSkyAPIUrl;
	if (apiUrl == null){
		alert("Make a .key.js file and enter your darkSkys API url into a variable called darkSkyAPIUrl. url must end in a backslash (/)");
	}
	if (locations && lat == 0 && long == 0){
		for (loop_var = 0; loop_var < locations.length; loop_var++){
			var url = apiUrl + locations[loop_var].ns_coordinate + ',' + locations[loop_var].ew_coordinate;
			urls[loop_var] = url;
			// console.log(`before api ${loop_var}`);
			// $.ajax({url:url, dataType:"jsonp"}).then(function(data) {
			// 	console.log(`after api ${loop_var}`);
			// 	weather_data[loop_var] = data;
			// 	console.log(weather_data);
			// })
			lats[loop_var] = locations[loop_var].ns_coordinate;
			longs[loop_var] = locations[loop_var].ew_coordinate;
			cities[loop_var] = locations[loop_var].location_name;
		}
		makeMap(urls, lats, longs, icons, cities);
	}
	else if (lat == 0 && long == 0){
		makeMap(urls, lats, longs, icons, cities);
	}
	else if (lat + long == 362){
		// var url = document.getElementById('latitudeInput').value + "," + document.getElementById('longitudeInput').value;
		// url = apiUrl+url;
		addMarker();
	}
	else{
		var url = lat +","+ long;
		urls[0] = apiUrl+url;
		lats[0] = lat;
		longs[0] = long;
		cities[0] = "set"
		//$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
			//weather_data[0] = data;
			makeMap(urls, lats, longs, icons, cities);
		//})
	}
}

function getCurrConditions(data, input){
	input.push(data.currently.icon);
	input.push(data.currently.temperature);
	input.push(data.currently.summary);
	input.push(data.daily.summary);
}

//makeMap takes 5 arguments: data - passed from loadData, lat - the entered latatude, long - longitude,
//icons - from getIcons, and city - if there is a city name expected or not (set to "set" if expected)
function makeMap(urls, lats, longs, icons, cities){
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	mymap.setMaxBounds([[36.7094, -110.2259],[41.6586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in
	var markers = [];
	for (i = 0; i < urls.length; i++){
		var city = cities[i];
		var lat = lats[i];
		var long = longs[i];
		var info = [];

		let marker1;
		let currIcon; // var storing the current icon
		let currWeather;
		let currTemp;
		let currSummary;
		let currConditions;

		$.ajax({url:urls[i], dataType:"jsonp"}).then(function(data) {
			getCurrConditions(data, info);
			//console.log(data);
			// different icons for the different weather types
			// iconurl: path to icon image
			// iconSize: size of icon image on map
			// icon anchor: where on the icon which corresponds to icon location
			// todo: fix the icons covering the city names
			currWeather = info[0];
			currTemp = info[1];
			currSummary = info[2];
			currConditions = info[3]; // var storing the current weather conditions

			// matching the current weather to the respective icon
			if(currWeather.includes('clear')){
				if(currWeather.includes('day')){
					currIcon = icons[0];
				}
				else if(currWeather.includes('night')){
					currIcon = icons[1];
				}
			}
			else if(currWeather.includes('cloudy')){
				currIcon = icons[2];
			}
			else if(currWeather.includes('rain')){
				currIcon = icons[3];
			}
			else if(currWeather.includes('storm')){
				currIcon = icons[5];
			}
			else{
				currIcon = icons[0];
			}
			//making marker update based on lat/lng inputs
			var locName = city;
			if (city == "set"){
				locName = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);
			}
			//make maker for page
			marker1 = new L.marker([lat, long], {icon: currIcon}).bindPopup("<h3>Weather Info For " + locName + '</h3>'
							+ '<h9 class="card-subtitle mb-2 text-muted">Entered Latitude and Longitude: '+ lat +" "+ long +'</h9>'
							+ '<div class="card bg-light">'
							+ '<dl class="row">'
							+ 	"<dt class='col-sm-7'>Current Temperature</dt>"
							+   "<dd class='col-sm-5'>" + currTemp +"\u00B0 F </dd> <br><br>"
							+	"<dt class='col-sm-7'>Current Weather</dt>"
							+   "<dd class='col-sm-5'>" + currSummary +"</dd> <br><br>"
							+ 	"<dt class='col-sm-5'>Conditions</dd>"
							+ "<dd class='col-sm-7'>" + currConditions + "</dd>"
							+ '</dl>'
							+ '</div>').addTo(mymap);
			markers.push(marker1);
		})
	}
	// for (i = 0; i < markers.length; i++){
	// 	markers[i].addTo(mymap);
	// }
}

//addMarker adds a marker to the map nbased on latatude and longitude
function addMarker(){
	var container = L.DomUtil.get('map'); //get map comtainer
	if(container != null){
        container._leaflet_id = null; //remove map if map exists
	}
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8); //make map view
	lat = document.getElementById('latitudeInput').value;
	lng = document.getElementById('longitudeInput').value;
	var apiUrl = darkSkyAPIUrl; // get API url
	var icons = getIcons(); //get icons for map
	var url = lat +","+ lng;
	url = apiUrl+url;
	//get map data and pass it so a pin can be made
	$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
		city = lat + ", " + lng;
		makeMap(data, lat, lng, icons, city);
	})
}
