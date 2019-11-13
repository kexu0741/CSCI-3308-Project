function makeMap(lat, long){
	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	var markers = [[40.0169, -105.2796, "Boulder"]];
	if(lat + long != 0){
		markers[markers.length] = [lat, long];
	}
	console.log(markers);
	mymap.setMaxBounds([[36.7094, -110.2259],[41.1586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in
	for(var i = 0; i < markers.length; i++){
		var marker = L.marker([markers[i][0], markers[i][1]]).addTo(mymap);
		marker.bindPopup('<h3>Weather info for ' + markers[i][2] + '</h3>'
						+ '<div class="card bg-light">'
						+ '<ul class="list-group">'
						+ 	'<li class = list-group-item>Current Temperature: </li>'
						+	'<li class = list-group-item>Feels Like: </li>'
						+ 	'<li class = list-group-item>Current Conditions: </li>'
						+ '</ul>'
						+ '</div>');
	}
}
