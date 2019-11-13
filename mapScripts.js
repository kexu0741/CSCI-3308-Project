function loadData(lat, long){
	///*************************************************************** */
	//apiUrl FIELD HERE> ENTER YOUR API URL WHERE IT SAYS NULL.
	///************************************************************** */
	//var url = null;
	//var apiUrl = darkSkyAPIUrl;
	var apiUrl = "https://api.darksky.net/forecast/56cfb34193238efd3d3d6a20ac5afc24/";
	if (apiUrl == null){
		alert("Make a .key.js file and enter your darkSkys API url into a variable called darkSkyAPIUrl. url must end in a backslash (/)");
	}
	var url = lat +","+ long;
	url = apiUrl+url;
	$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
		makeMap(data, lat, long);
	})
}

function makeMap(data, lat, long){
	// var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	// L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
	// 	attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	// }).addTo(mymap);
	// var markers = [[40.0169, -105.2796, "Boulder"]];
	// if(lat + long != 0){
	// 	markers[markers.length] = [lat, long];
	// }
	// console.log(markers);
	// mymap.setMaxBounds([[36.7094, -110.2259],[41.1586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in
	// for(var i = 0; i < markers.length; i++){
	// 	var marker = L.marker([markers[i][0], markers[i][1]]).addTo(mymap);
	// 	marker.bindPopup('<h3>Weather info for ' + markers[i][2] + '</h3>'
	// 					+ '<div class="card bg-light">'
	// 					+ '<ul class="list-group">'
	// 					+ 	'<li class = list-group-item>Current Temperature: </li>'
	// 					+	'<li class = list-group-item>Feels Like: </li>'
	// 					+ 	'<li class = list-group-item>Current Conditions: </li>'
	// 					+ '</ul>'
	// 					+ '</div>');
	// }
	console.log(lat, long);
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	mymap.setMaxBounds([[36.7094, -110.2259],[41.6586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in


	// different icons for the different weather types
	// iconurl: path to icon image
	// iconSize: size of icon image on map
	// icon anchor: where on the icon which corresponds to icon location
	// todo: fix the icons covering the city names

	var sunnyIcon = L.icon({
		iconUrl:'../img/sunny.png',

		iconSize: [30, 30],
		iconAnchor: [15, 30]
	});

	var clearNightIcon = L.icon({
		iconUrl: '../img/clearnight.png',

		iconSize: [30, 30],
		iconAnchor: [15,30]
	})

	var cloudyIcon = L.icon({ // TODO: find new image
		iconUrl:'../img/cloudy.png',

		iconSize: [30, 30],
		iconAnchor: [22, 40]
	});

	var rainyIcon = L.icon({
		iconUrl:'../img/rain.png',

		iconSize: [30, 30],
		iconAnchor: [15, 30]
	});

	var snowyIcon = L.icon({ // TODO: find new image
		iconUrl:'../img/snow.png',

		iconSize: [30, 30],
		iconAnchor: [15, 35]
	});

	var stormIcon = L.icon({
		iconUrl:'../img/thunderstorm.png',

		iconSize: [30, 30],
		iconAnchor: [15, 28]
	});

	var alertIcon = L.icon({ // TODO: find new image
		iconUrl:'../img/alert.png',

		iconSize: [30, 30],
		iconAnchor: [22, 40]
	});

	var redAlertIcon = L.icon({ //
		iconUrl:'../img/redalert.png',

		iconSize: [20, 20],
		iconAnchor: [10, 5]
	});

	var currIcon; // var storing the current icon
	var currWeather = data.currently.icon; // var storing the current weather conditions
	console.log(data);
	console.log(currWeather);

	// matching the current weather to the respective icon
	if(currWeather.includes('clear')){
		if(currWeather.includes('day')){
			currIcon = sunnyIcon;
		}
		else if(currWeather.includes('night')){
			currIcon = clearNightIcon;
		}
	}
	else if(currWeather.includes('cloudy')){
		currIcon = cloudyIcon;
	}
	else if(currWeather.includes('rain')){
		currIcon = rainyIcon;
	}
	else if(currWeahter.includes('storm')){
		currIcon = stormIcon;
	}

	//console.log(currIcon.iconUrl);
	//making marker update based on lat/lng inputs
	var marker1 = L.marker([lat,long], {icon: currIcon}).addTo(mymap);
	//marker1.addTo(mymap);


	marker1.bindPopup('<h3>Weather info for (cityname)</h3>'
					+ '<p>Entered latitude and longitude: '+ lat +" "+ long +'</p>'
					+ '<div class="card bg-light">'
					+ '<ul class="list-group">'
					+ 	"<li class = list-group-item>Current Temperature: " +data.currently.temperature+"\u00B0 F </li>"
					+	'<li class = list-group-item>Current Weather: '+  data.currently.summary+' </li>'
					+ 	"<li class = list-group-item>Conditions: "+data.daily.summary+" </li>"
					+ '</ul>'
					+ '</div>');

}
