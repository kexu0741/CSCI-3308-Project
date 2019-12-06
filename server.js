/*
	-you can search for locations, and, if they are in the database, a new marker will be added to the map
	-the first name and password fields in userprofiles will be saved to your database upon clicking the save button
*/

const express = require('express');
const mail = require('nodemailer');

let app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
globalVariable = {};


// setting up dbconfig for heroku
const dbConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: true,
};

var db = pgp(dbConfig);


const mail_from = mail.createTransport({
  service: 'gmail',
  auth: {
    user: 'thedisastertracker@gmail.com',
    pass: 'plschange'
  }
});

var check_subscribers = "SELECT email,subscribe FROM users;"; // get all users to check if subscribed
db.query(check_subscribers)
	.then(function(info) {
		var mailing_list = '';
		for(i = 0; i < info.length; i++){ // formats string with all emails that are subscribed
			if(info[i].subscribe === true){
				if(mailing_list.length != 0){
					mailing_list += ', ';
				}
				mailing_list += info[i].email;
			}
		}
		var message = { // composition of the email
		  from: 'thedisastertracker@gmail.com',
		  to: mailing_list,
		  subject: 'If this works, hurrah',
		  text: 'cool weather stuff'
		};

	})


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/home', function(req, res) { // renders homepage
	// querying data for the top 18 most populated cities in Colorado as default values
	var query = "SELECT * FROM locations WHERE location_name = 'Boulder' OR location_name = 'Denver' "
	+ "OR location_name = 'Colorado Springs' "
	+ "OR location_name = 'Aurora' "
	+ "OR location_name = 'Steamboat Springs'"
	+ "OR location_name = 'Loveland'"
	+ "OR location_name = 'Estes Park'"
	+ "OR location_name = 'Idaho Springs'" 
	+ "OR location_name = 'Fort Collins' "
	+ "OR location_name = 'Pueblo' "
	+ "OR location_name = 'Fort Morgan'"
	+ "OR location_name = 'Limon'"
	+ "OR location_name = 'Glenwood Springs'"
	+ "OR location_name = 'Lakewood' "
	+ "OR location_name = 'Thornton' "
	+ "OR location_name = 'Arvada' " 
	+ "OR location_name = 'Westminster' " 
	+ "OR location_name = 'Centennial' "
	+ "OR location_name = 'Highlands Ranch' "
	+ "OR location_name = 'Greeley' "
	+ "OR location_name = 'Longmont' "
	+ "OR location_name = 'Loveland' " 
	+ "OR location_name = 'Broomfield' "
	+ "OR location_name = 'Grand Junction';";
	db.query(query)
		.then(function(info){
			res.render(__dirname + "/home",{
				my_title:"Home",
				api_key: process.env.kevinAPIkey,
				data: info,
				multiLocs: info
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

app.get('/', function(req, res) { // renders homepage
	res.render(__dirname + "/home",{
		my_title:"Home"
	});
});

app.get('/', function(req, res) { // renders homepage
	res.render(__dirname + "/home",{
		my_title:"Home"
	});
});

app.get('/userprofile', function(req, res) { // renders userprofile page
	res.render(__dirname + "/userprofile",{
		my_title:"Login Page"
	});
});

app.post('/userprofile/register', function(req, res) { // saves user info to DB
	var body = req.body;
	var insert_user = "INSERT INTO users(first_name,last_name,phone,mobile,email,password,subscribe)VALUES('";
	var location_check = "SELECT id FROM locations WHERE location_name = '" + body.location + "';";
	insert_user += body.first_name + "','" + body.last_name + "','" + body.phone  + "','" + body.mobile + "','" + body.email + "','" + body.password + "','" + body.subscribe + "') ON CONFLICT DO NOTHING;";
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
	res.render(__dirname + '/login')
});

app.get('/login', function(req, res) { // renders userprofile page
	res.render(__dirname + "/login",);
});

app.post('/home/user_loc', function(req, res) {
	var get_locations = "SELECT locations FROM users WHERE email = '" + req.body.usrname + "';"; // pulling all locations that the user has saved and passing their ids to the pug page
	db.query(get_locations)
		.then(function(info) {
			var locations = info[0].locations;
			if (locations.length > 0){
				var get_coords = "SELECT * FROM locations WHERE id = ";
				for (i = 0; i < locations.length; i++){
					get_coords += locations[i];
					if (i < locations.length - 1){
						get_coords += " OR id = ";
					}
					else{
						get_coords += ";";
					}
				}
				db.query(get_coords)
					.then(function(info) {
						var loc_info = new Array(50);
						for (i = 0; i < loc_info.length; i++){
							loc_info[i] = new Array(3);
						}
						for (i = 0; i < info.length; i++){
							loc_info[i][0] = info[i].location_name;
							loc_info[i][1] = info[i].ns_coordinate;
							loc_info[i][2] = info[i].ew_coordinate;
						}
						console.log(loc_info);
						res.render(__dirname + '/home',{
							user_locations: loc_info
						});
					})
			}
			else{
				res.render(__dirname + '/home',{
					my_title:"Home"
				});
			}
		})
});

app.listen(process.env.PORT || 8000); // listens on heroku's port or port 8000
