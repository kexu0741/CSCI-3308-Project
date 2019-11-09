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

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'disaster_tracker',
	user: 'postgres',
	password: 'password' // when testing, remember to change this to your password
};

let db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/home', function(req, res) { // renders homepage
	res.render(__dirname + "/home",{
		my_title:"Home"
	});
});

app.get('/home/search', function(req, res) { // renders homepage with search query
	var searchTerm = req.query.search;
	console.log(req.query.search);
	var query = "SELECT * FROM locations WHERE location_name = '" + searchTerm + "';";
	console.log(query);
	db.query(query) // searches DB
		.then(function(info) {
			console.log(info[0]);
			res.render(__dirname + "/home",{
				my_title:"Home",
				data:info[0] // contains the results of the search
		})
	})
})

app.get('/userprofile', function(req, res) { // renders userprofile page
	res.render(__dirname + "/userprofile",{
		my_title:"Login Page"
	});
});

app.post('/userprofile/register', function(req, res) { // saves username and password to DB
	res.status(204).send();
	var body = req.body;
	console.log(body);
	var insert_user = "INSERT INTO user_profiles(username, password)VALUES('";
	insert_user += body.first_name + "','" + body.password + "') ON CONFLICT DO NOTHING;";
	db.query(insert_user, (err,res)=>{
		console.log(err,res)
	})
});

app.listen('3000');
