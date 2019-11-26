/*
	-you can search for locations, and, if they are in the database, a new marker will be added to the map
	-the first name and password fields in userprofiles will be saved to your database upon clicking the save button
*/

const express = require('express');
let app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
globalVariable = {};


const dbConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: true,
};

var db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/home', function(req, res) { // renders homepage
	var query = "SELECT * FROM locations WHERE location_name = 'Boulder' OR location_name = 'Denver';";
	db.query(query)
		.then(function(info){
			console.log(info);
			res.render(__dirname + "/home",{
				my_title:"Home",
				api_key: process.env.kevinAPIkey,
				data: info
				// user_locations: info
			});
		})
});

app.get('/home/search', function(req, res) { // renders homepage with search query
	var searchTerm = req.query.search;
	var query = "SELECT * FROM locations WHERE location_name = '" + searchTerm + "';";
	db.query(query) // searches DB
		.then(function(info) {
			console.log("info: " + info[0].location_name);
			res.render(__dirname + "/home",{
				my_title:"Home",
				api_key: process.env.kevinAPIkey,
				data:info, // contains the results of the search
				user_locations: JSON.stringify(info[0].location_name)
			});
		})
})

app.get('/userprofile', function(req, res) { // renders userprofile page
	res.render(__dirname + "/userprofile",{
		my_title:"Login Page"
	});
});

app.post('/userprofile/register', function(req, res) { // saves user info to DB
	res.status(204).send();
	var body = req.body;
	var insert_user = "INSERT INTO users(first_name,last_name,phone,mobile,email,password)VALUES('";
	var location_check = "SELECT id FROM locations WHERE location_name = '" + body.location + "';";
	insert_user += body.first_name + "','" + body.last_name + "','" + body.phone  + "','" + body.mobile + "','" + body.email + "','" + body.password + "') ON CONFLICT DO NOTHING;";
	db.task('get-everything', task => {
			return task.batch([
					task.any(insert_user),
					task.any(location_check)
			]);
	})
	.then(data => {
		var id = data[1][0].id;
		if(id){
			var insert_location = "UPDATE users SET locations = ARRAY_APPEND(locations," + id + ") WHERE email = '" + body.email + "';";
			db.query(insert_location)
		}
	})
});

app.get('/login', function(req, res) { // renders userprofile page
	res.render(__dirname + "/login",);
});

app.post('/home/user_loc', function(req, res) {
	var get_locations = "SELECT locations FROM users WHERE email = '" + req.body.usrname + "';";
	db.query(get_locations)
		.then(function(info) {
			var locations = info[0].locations;
			res.render(__dirname + '/home',{
				user_locations: locations
			});
		})
})

app.listen(process.env.PORT || 3000);
