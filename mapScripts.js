if(window.location.pathname == '/'){
	window.location.pathname = '/home';
}

function getIcons(){
	// different icons for the different weather types
	// iconurl: path to icon image
	// iconSize: size of icon image on map
	// icon anchor: where on the icon which corresponds to icon location

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

function loadData(lats, longs, locations, apiUrl){
	if (apiUrl == null){
		alert("Make a .key.js file and enter your darkSkys API url into a variable called darkSkyAPIUrl. url must end in a backslash (/)");
	}

	var icons = getIcons();

	if (lats[0] + longs[0] == 362){
		console.log('apiUrl');
		addMarker(apiUrl);
	}
	else{
		var icons = getIcons();
		var urls = [];
		for(var i = 0; i < lats.length; i++){ //creates api url for each lat/long passed in
			var url = lats[i] + "," + longs[i];
			url = apiUrl+url;
			urls[i] = url;
		}
		makeMap(urls, lats, longs, icons, locations);
	}
}


//makeMap takes 5 arguments: urls - api urls passed from loadData, lats - array of lattitudes passed from loadData, longs - longitude, 
//icons - from getIcons, and cities - if there is a city name expected or not (set to "set" if expected)
function makeMap(urls, lats, longs, icons, cities){
	var container = L.DomUtil.get('map');
	if(container != null){
        container._leaflet_id = null;
    }
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	mymap.setMaxBounds([[36.7094, -110.3259],[42.0595, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in

	for(let i = 0; i < urls.length; i++){
		let lat = lats[i];
		let long = longs[i];

		let locName = cities[i];

		// variables for creating current icon
		let marker1;
		let currIcon;
		let currWeather;
		let currTemp;
		let currSummary;
		let currConditions;

		let info = []; // array storing weather info from darkskysAPI call

		$.ajax({url:urls[i], dataType:"jsonp"}).then(function(data) {
			getCurrConditions(data, info);

			currWeather = info[0];
			currTemp = info[1];
			currSummary = info[2];
			currConditions = info[3];

			// matching the current weather to the respective icon
			if(currWeather.includes('clear')){
				if(currWeather.includes('day')){
					currIcon = icons[0];
				}
				else if(currWeather.includes('night')){
					currIcon = icons[1];
				}
			}
			else if(currWeather.includes('cloudy') || currWeather.includes('fog')){
				currIcon = icons[2];
			}
			else if(currWeather.includes('rain')){
				currIcon = icons[3];
			}
			else if(currWeather.includes('snow')){
				currIcon = icons[4];
			}
			else if(currWeather.includes('storm')){
				currIcon = icons[5];
			}

			//adding marker to map	
			marker1 = new L.marker([lat, long], {icon: currIcon}).bindPopup("<h3>Weather Info For " + locName + '</h3>'
							+ '<h9 class="card-subtitle mb-2 text-muted">Entered Latitude and Longitude: '+ lat +" "+ long +'</h9>'
							+ '<div class="card bg-light">'
							+ '<dl class="row">'
							+ 	"<dt class='col-sm-7'>Current Temperature</dt> <br>"
							+   "<dd class='col-sm-5'>" + currTemp +"\u00B0 F </dd> <br><br>"
							+	"<dt class='col-sm-7'>Current Weather</dt> <br>"  
							+   "<dd class='col-sm-5'>" + currSummary +"</dd> <br><br>"
							+ 	"<dt class='col-sm-7'>Conditions</dd> <br>"
							+ "<dd class='col-sm-5'>" + currConditions + "</dd>"
							+ '</dl>'
							+ '</div>').addTo(mymap);
		})
	}
}

//getCurrConditions takes two arguments: data - function param from ajax callback,
//input- array to be populated with weather data from API call
function getCurrConditions(data, input){ 
	input.push(data.currently.icon); 
	input.push(data.currently.temperature);
	input.push(data.currently.summary);
	input.push(data.daily.summary);
}

//addMarker adds a marker to the map nbased on latatude and longitude
function addMarker(key){
	var container = L.DomUtil.get('map'); //get map comtainer
	if(container != null){ 
        container._leaflet_id = null; //remove map if map exists
	}
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8); //make map view
	lat = document.getElementById('latitudeInput').value;
	lng = document.getElementById('longitudeInput').value;	
	var apiUrl = key; // get API url
	var icons = getIcons(); //get icons for map
	var url = lat +","+ lng;
	url = apiUrl+url;

	var latParam = parseInt(lat);
	var lngParam = parseInt(lng);

	if ((latParam > 37 && latParam < 41) && (lngParam > -109.03 && lngParam < -102.03)){
		makeMap([url], [latParam], [lngParam], icons, ["User Coordinates"]);
	}
	else{
		alert('error: invalid coordinates');
	}
}
