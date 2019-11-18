
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
	//apiUrl FIELD HERE> ENTER YOUR API URL WHERE IT SAYS NULL.
	///************************************************************** */
	//var url = null;
	var apiUrl = darkSkyAPIUrl;
	if (apiUrl == null){
		alert("Make a .key.js file and enter your darkSkys API url into a variable called darkSkyAPIUrl. url must end in a backslash (/)");
	}

	console.log(locations);

	if (lat + long == 362){
		// var url = document.getElementById('latitudeInput').value + "," + document.getElementById('longitudeInput').value;
		// url = apiUrl+url;
		addMarker();
	}
	else{
		var icons = getIcons();
		var url = lat +","+ long;
		url = apiUrl+url;
		$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
			makeMap(data, lat, long, icons);
		})
	}
}

function makeMap(data, lat, long, icons){
	console.log(icons);
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


	var currIcon; // var storing the current icon
	var currWeather = data.currently.icon; // var storing the current weather conditions
	console.log(data);

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
	else if(currWeahter.includes('storm')){
		currIcon = icons[5];
	}

	//console.log(currIcon.iconUrl);
	//making marker update based on lat/lng inputs
	var marker1 = L.marker([lat,long], {icon: currIcon}).addTo(mymap);
	//marker1.addTo(mymap);

	var locName = window.location.href.substring(window.location.href.lastIndexOf('=') + 1);

	marker1.bindPopup('<h3>Weather info for ' + locName + '</h3>'
					+ '<p>Entered latitude and longitude: '+ lat +" "+ long +'</p>'
					+ '<div class="card bg-light">'
					+ '<ul class="list-group">'
					+ 	"<li class = list-group-item>Current Temperature: " +data.currently.temperature+"\u00B0 F </li>"
					+	'<li class = list-group-item>Current Weather: '+  data.currently.summary+' </li>'
					+ 	"<li class = list-group-item>Conditions: "+data.daily.summary+" </li>"
					+ '</ul>'
					+ '</div>');

}

function addMarker(){
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	marker1 = L.marker([document.getElementById('latitudeInput').value,document.getElementById('longitudeInput').value]).addTo(mymap);
}
