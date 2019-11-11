window.onload = function(){
	loadData();
	
}

function loadData(){
	console.log("hi");
	var url ='https://api.darksky.net/forecast/01488d2e3a2dadb78a720c0b557d7ecc/'+ document.getElementById('latitudeInput').value +","+ document.getElementById('longitudeInput').value;
	
	$.ajax({url:url, dataType:"jsonp"}).then(function(data) {
		console.log("before makeMap")
		makeMap(data);
		console.log("after makeMap")
	})
}

function makeMap(data){
	console.log("in make map");
	$("#parent_id").children(":not(#id_n)").remove();

	var mymap = L.map('map', {minZoom: 7.45}).setView([40.0169, -105.2796], 8);
	console.log("after var");
	L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=v3Mu9999pyuOUuraMgce', {
		attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
	}).addTo(mymap);
	mymap.setMaxBounds([[36.7094, -110.2259],[41.1586, -101.6997]])// //mymap.setMaxBounds(mymap.getBounds()); // <-- alternatively, sets bounds to the frame the map opens up in
	//document.getElementById('latitudeInput').value, document.getElementById('longitudeInput').value
	console.log(document.getElementById('latitudeInput').value);
	var marker = L.marker([document.getElementById('latitudeInput').value,document.getElementById('longitudeInput').value]).addTo(mymap);
	marker.bindPopup('<h3>Weather info for (cityname)</h3>' 
					+ '<div class="card bg-light">'
					+ '<ul class="list-group">'
					+ 	"<li class = list-group-item>Current Temperature: " +data.currently.temperature+" </li>"
					+	'<li class = list-group-item>Current Weather: '+  data.currently.summary+' </li>'
					+ 	"<li class = list-group-item>Conditions: "+data.daily.summary+" </li>"
					+ '</ul>'
					+ '</div>');
	
}