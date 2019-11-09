const express = require('express'); // Add the express framework has been added
let app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'disaster_tracker',
	user: 'postgres',
	password: 'M1ndB4Mouth'
};

let db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/home', function(req, res) {
	res.render(__dirname + "/home",{
		my_title:"Home"
	});
});

// app.post('/home/search', function(req, res, next) {
//   res.render(__dirname + '/home.html',{
// 	 	message: 'Hello World'
// 	});
// });

app.get('/home/search', function(req, res) {
	var searchTerm = req.query.search;
	console.log(req.query.search);
	var query = "SELECT * FROM locations WHERE location_name = '" + searchTerm + "';";
	console.log(query);
	db.query(query)
		.then(function(info) {
			console.log(info[0]);
			res.render(__dirname + "/home",{
				my_title:"Home",
				data:info[0]
		})
	})
})

app.get('/userprofile', function(req, res) {
	res.render(__dirname + "/userprofile",{
		my_title:"Login Page"
	});
});

// app.get('/userprofile/register', function(req, res) {
// 	res.render(__dirname + "/userprofile.html",{
// 		my_title:"Login Page"
// 	});
// });

app.post('/userprofile/register', function(req, res) {
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
