/*
------------------------------------WARNING-------------------------------------
YOU WILL NEED TO RUN THIS FILE MULTIPLE TIMES IN ORDER FOR ALL QUERIES TO TAKE
EFFECT.
*/

const {Pool, Client} = require('pg');
const fs = require('fs');

var create_locations = "CREATE TABLE IF NOT EXISTS locations(id SMALLSERIAL PRIMARY KEY,location_name TEXT NOT NULL,ns_coordinate DECIMAL NOT NULL,ew_coordinate DECIMAL NOT NULL)";
var create_users = "CREATE TABLE IF NOT EXISTS user_profiles(id SERIAL PRIMARY KEY,username VARCHAR(30) NOT NULL,password VARCHAR(30) NOT NULL,saved_locations INTEGER[])";
var insert_statement = "INSERT INTO locations(location_name, ns_coordinate, ew_coordinate) VALUES";

fs.readFile('default_locations.txt', (err, data) => {
    if (err) throw err;

    var split = data.toString().replace(/(\r\n|\n|\r)/gm, ""); // gettig rid of all newlines
    split = split.split(','); // separating into individual pieces of information
    var splitLength = split.length - 2;

    for(i = 0; i < splitLength; i+=3){ // this loop formats each individual set of values to be inserted
      var extra = "('" + split[i] + "', " + split[i+1] + ", " + split[i+2] + ")"; // name stored at split[i], coordinates stored at split[i+1] and split[i+2]
      if(i < splitLength - 3){ // need commas after every set of values except the last one
        extra += ",";
      }
      //console.log(extra);
      insert_statement += extra; // building full statement
    }
    insert_statement += " ON CONFLICT DO NOTHING;"; // this stops the query from overwriting previous data
    console.log(insert_statement);
})

//If you are testing this on your own machine, remember to put the name of your database and to put your postgres password
const dbConfig = new Pool({
  host: 'localhost',
	port: 5432,
	database: 'disaster_tracker', // name of db
	user: 'postgres',
	password: "" // postgres password (your password here)
})

/*
  Postgres does not accept insert_statement as a query, throwing an error saying 'error at end of input'
  I could not get it to work using a variable, so I copied insert_statement directly from the console into the query parameter
  This makes me think that the issue lies with how javaScript formats the string
  If you can fix it, wonderful. Otherwise, this is functional
*/


dbConfig.query(create_locations,(err,res)=>{
  console.log(err,res)
})

dbConfig.query(create_users,(err,res)=>{
  console.log(err,res)
})
