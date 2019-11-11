window.onload = function(){
	loadData();
	
}

function loadData(){
	var url ='https://api.darksky.net/forecast/01488d2e3a2dadb78a720c0b557d7ecc/'+ document.getElementById('latitudeInput').value +","+ document.getElementById('longitudeInput').value;
	
	$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
		makeMap(data);
	})
}

//makeMape takes one argument, data, and creates the map object as well as puts a marker onto it.
function makeMap(data){
	$("#parent_id").children(":not(#id_n)").remove();
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	console.log("after var");
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
	var marker = L.marker([document.getElementById('latitudeInput').value,document.getElementById('longitudeInput').value], {icon: redAlertIcon}).addTo(mymap);

	
	marker.bindPopup('<h3>Weather info for (cityname)</h3>' 
					+ '<div class="card bg-light">'
					+ '<ul class="list-group">'
					+ 	"<li class = list-group-item>Current Temperature: " +data.currently.temperature+" </li>"
					+	'<li class = list-group-item>Current Weather: '+  data.currently.summary+' </li>'
					+ 	"<li class = list-group-item>Conditions: "+data.daily.summary+" </li>"
					+ '</ul>'
					+ '</div>');
	
}