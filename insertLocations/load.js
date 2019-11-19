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
    //console.log(insert_statement);
})

//If you are testing this on your own machine, remember to put the name of your database and to put your postgres password
const dbConfig = new Pool({
  host: 'localhost',
	port: 5432,
	database: 'disaster_tracker', // name of db
	user: 'postgres',
	password: 'Listen420' // postgres password
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

dbConfig.query("INSERT INTO locations(location_name, ns_coordinate, ew_coordinate) VALUES('Sanford', 37.2574, -105.9007),('Aurora', 39.7084, -104.7274),('Avondale', 38.2351, -104.3434),('Alpine', 37.6877, -106.586),('Pitkin', 38.6086, -106.5164),('Smeltertown', 38.5524, -106.0085),('Bethune', 39.3038, -102.4234),('Golden', 39.7406, -105.2118),('Divide', 38.945, -105.1619),('City of Creede', 37.8488, -106.9252),('Amherst', 40.6831, -102.1725),('Ward', 40.0726, -105.5136),('Norwood', 38.1286, -108.2918),('Grover', 40.8691, -104.2259),('La Junta Gardens', 38.0014, -103.5549),('Bennett', 39.7366, -104.4286),('Sugarloaf', 40.0189, -105.4078),('Walsh', 37.3861, -102.2801),('Elbert', 39.2189, -104.5403),('Louisville', 39.9709, -105.1441),('Elizabeth', 39.36, -104.6072),('Valmont', 40.0341, -105.2058),('Hasty', 38.1063, -102.956),('Holyoke', 40.5826, -102.2985),('Denver', 39.7621, -104.8759),('St. Ann Highlands', 39.9873, -105.4557),('Gleneagle', 39.0453, -104.8288),('Columbine', 39.5879, -105.0694),('Mead', 40.2321, -104.9928),('Keenesburg', 40.1111, -104.5041),('Cathedral', 38.0836, -107.0306),('Columbine Valley', 39.5993, -105.035),('Oak Creek', 40.2738, -106.9574),('Ordway', 38.2209, -103.7567),('Segundo', 37.1225, -104.7396),('Grand Junction', 39.0877, -108.5673),('Thornton', 39.9205, -104.9443),('Brandon', 38.4464, -102.4412),('Coal Creek', 38.362, -105.1417),('El Moro', 37.2349, -104.4492),('Crested Butte', 38.8676, -106.9772),('Commerce City', 39.8643, -104.8433),('La Junta', 37.9796, -103.5473),('Guffey', 38.7591, -105.5024),('Lewis', 37.5017, -108.66),('Fleming', 40.6818, -102.8395),('Rico', 37.6892, -108.0318),('Idalia', 39.7029, -102.2938),('Kremmling', 40.0565, -106.3782),('Montezuma', 39.5817, -105.8681),('Towner', 38.4705, -102.0804),('Leyner', 40.0511, -105.1073),('Green Mountain Falls', 38.9343, -105.0237),('Kersey', 40.3895, -104.5771),('Red Feather Lakes', 40.8071, -105.5864),('Stratmoor', 38.7731, -104.7787),('Stonegate', 39.5357, -104.8032),('Lamar', 38.074, -102.6155),('Saguache', 38.0862, -106.1407),('Vernon', 39.9399, -102.3074),('Seven Hills', 40.0361, -105.3323),('Vail', 39.6386, -106.3608),('Floyd Hill', 39.7241, -105.4306),('Crisman', 40.0416, -105.3674),('Hidden Lake', 40.1055, -105.4777),('Cokedale', 37.1445, -104.6217),('Sunshine', 40.0636, -105.3696),('Sheridan', 39.6467, -105.018),('Cherry Creek', 39.6094, -104.8645),('Maybell', 40.5191, -108.0889),('Edgewater', 39.7507, -105.0626),('Air Force Academy', 38.9942, -104.8639),('Allenspark', 40.2099, -105.5112),('Kim', 37.2471, -103.3533),('Campo', 37.1046, -102.5787),('Stonewall Gap', 37.1605, -105.0342),('Alamosa East', 37.4767, -105.8396),('Roxborough Park', 39.4492, -105.0746),('Colorado City', 37.9365, -104.8459),('La Jara', 37.2735, -105.9597),('Larkspur', 39.2318, -104.8923),('Woodland Park', 38.9987, -105.0595),('Snowmass Village', 39.2203, -106.9393),('Aguilar', 37.4036, -104.655),('Wray', 40.0799, -102.2278),('Todd Creek', 39.9795, -104.8726),('Ramah', 39.1222, -104.1673),('Clifton', 39.0763, -108.4606),('Dotsero', 39.6463, -107.054),('Atwood', 40.5505, -103.2746),('Altona', 40.1254, -105.2923),('Castle Rock', 39.3762, -104.8535),('South Fork', 37.6693, -106.6426),('Towaoc', 37.2126, -108.7265),('Holly', 38.0554, -102.1247),('Evergreen', 39.6349, -105.3356),('Cherry Hills Village', 39.6375, -104.9481),('Shaw Heights', 39.8566, -105.039),('Mountain Village', 37.9323, -107.8578),('Mountain Meadows', 40.027, -105.3832),('Cattle Creek', 39.4667, -107.2599),('Walsenburg', 37.6307, -104.7818),('Ouray', 38.0276, -107.6734),('Burlington', 39.3042, -102.2714),('Cripple Creek', 38.7461, -105.184),('Northglenn', 39.9107, -104.9783),('Ault', 40.5893, -104.7392),('Collbran', 39.2401, -107.9638),('Kit Carson', 38.7629, -102.7954),('Norrie', 39.328, -106.6562),('Sawpit', 37.9947, -108.0022),('Colorado Springs', 38.8674, -104.7606),('Olathe', 38.6084, -107.9827),('Redvale', 38.1761, -108.4126),('Marble', 39.0717, -107.1906),('Blue River', 39.4357, -106.0353),('Milliken', 40.3113, -104.8562),('Fairmount', 39.7931, -105.1712),('Holly Hills', 39.6679, -104.9218),('Trinidad', 37.175, -104.4908),('Raymer', 40.6077, -103.8444),('Johnstown', 40.3499, -104.9481),('Winter Park', 39.8779, -105.7827),('North Washington', 39.8085, -104.9792),('Moffat', 38.002, -105.9055),('Palisade', 39.1083, -108.3573),('Fulford', 39.5166, -106.6576),('Julesburg', 40.9851, -102.2626),('Dakota Ridge', 39.6194, -105.1341),('Springfield', 37.4049, -102.6189),('Southern Ute', 37.0749, -107.5933),('Grand View Estates', 39.5439, -104.8189),('Sugar City', 38.2328, -103.6634),('Manitou Springs', 38.8576, -104.9127),('Hugo', 39.1361, -103.4735),('Downieville-Lawson-Dumont', 39.7662, -105.6126),('Merino', 40.4847, -103.3537),('No Name', 39.5597, -107.293),('Meridian', 39.539, -104.8476),('Aspen Park', 39.5423, -105.2968),('Akron', 40.1644, -103.2206),('Mulford', 39.4064, -107.166),('Telluride', 37.9365, -107.8264),('Applewood', 39.7524, -105.1604),('Valdez', 37.1239, -104.6794),('Gunnison', 38.5455, -106.9226),('Eagle', 39.6368, -106.8123),('Johnson Village', 38.812, -106.1071),('Swink', 38.0142, -103.6282),('Lyons', 40.2231, -105.2692),('Central City', 39.7963, -105.5151),('Seibert', 39.298, -102.8695),('Hot Sulphur Springs', 40.0748, -106.1025),('Silverthorne', 39.6564, -106.0871),('Woody Creek', 39.2709, -106.8884),('Fruita', 39.154, -108.7286),('Saddle Ridge', 40.3134, -103.8023),('Craig', 40.517, -107.5558),('Aspen', 39.1948, -106.837),('Ovid', 40.9605, -102.3884),('Cortez', 37.3502, -108.577),('Salida', 38.53, -105.9984),('Berthoud', 40.3061, -105.0404),('Minturn', 39.546, -106.3873),('Otis', 40.1501, -102.9621),('Poncha Springs', 38.5131, -106.0962),('Blende', 38.2469, -104.5692),('Hooper', 37.746, -105.8777),('La Salle', 40.3484, -104.7062),('Eldorado Springs', 39.9367, -105.2625),('Florissant', 38.9445, -105.2899),('Parshall', 40.0555, -106.1758),('Firestone', 40.1563, -104.9495),('Jackson Lake', 40.3756, -104.0711),('Gold Hill', 40.0597, -105.4189),('Yuma', 40.1239, -102.7164),('Del Norte', 37.6784, -106.3539),('Monte Vista', 37.5788, -106.1503),('Fairplay', 39.2245, -105.9959),('Buena Vista', 38.8319, -106.1389),('Weldona', 40.3483, -103.9693),('Walden', 40.7315, -106.2813),('Colona', 38.3274, -107.7795),('Howard', 38.4098, -105.8424),('Breckenridge', 39.4994, -106.0433),('Crawford', 38.7053, -107.61),('Nucla', 38.2664, -108.5488),('Indian Hills', 39.6294, -105.2509),('Aristocrat Ranchettes', 40.1096, -104.7549),('Crowley', 38.1935, -103.8598),('Sterling', 40.6207, -103.1919),('Comanche Creek', 39.615, -104.3268),('Timnath', 40.5332, -104.9605),('Vineland', 38.2447, -104.4599),('Wellington', 40.7007, -105.0057),('Salt Creek', 38.2389, -104.5881),('Mountain View', 39.7748, -105.0567),('Sherrelwood', 39.839, -105.0014),('Naturita', 38.2186, -108.5683),('Orchard Mesa', 39.0363, -108.5172),('Englewood', 39.6468, -104.9942),('Castle Pines', 39.4625, -104.8706),('Wiggins', 40.2289, -104.072),('Eads', 38.4813, -102.7798),('Orchard City', 38.814, -107.9708),('Ridgway', 38.1573, -107.7545),('Brighton', 39.9716, -104.7964),('Aetna Estates', 39.7381, -104.6732),('Midland', 38.8469, -105.1577),('San Acacio', 37.2086, -105.5667),('Ponderosa Park', 39.3986, -104.6355),('Haxtun', 40.6415, -102.6295),('Hartman', 38.1211, -102.2216),('Morrison', 39.6431, -105.1936),('Ophir', 37.8568, -107.8289),('Bark Ranch', 40.1156, -105.4416),('Manzanola', 38.1088, -103.8669),('Laird', 40.0819, -102.102),('Hotchkiss', 38.7991, -107.7137),('Tall Timber', 40.0151, -105.3498),('Blue Sky', 40.3001, -103.8056),('Crestone', 37.9945, -105.6963),('Westcliffe', 38.134, -105.4654),('Boone', 38.2493, -104.2579),('Durango', 37.2744, -107.8703),('Woodmoor', 39.1063, -104.8456),('Lakewood', 39.6977, -105.1168),('Silver Plume', 39.6955, -105.7266),('Pueblo', 38.2713, -104.6105),('Alma', 39.2862, -106.068),('Gerrard', 37.6783, -106.5752),('Dinosaur', 40.2405, -109.0086),('Kiowa', 39.3436, -104.458),('Nunn', 40.7132, -104.7884),('San Luis', 37.2023, -105.4224),('Rock Creek Park', 38.7011, -104.8346),('Padroni', 40.7818, -103.1733),('Kittredge', 39.6593, -105.3045),('Loma', 39.2075, -108.805),('De Beque', 39.2879, -108.1952),('Sedalia', 39.4396, -104.9698),('Hoehne', 37.2816, -104.389),('Iliff', 40.7584, -103.066),('Limon', 39.2652, -103.6852),('Florence', 38.3835, -105.1114),('Silver Cliff', 38.1204, -105.4104),('Ellicott', 38.8256, -104.3829),('Black Hawk', 39.8044, -105.4946),('Highlands Ranch', 39.5419, -104.9708),('Inverness', 39.5788, -104.8624),('Byers', 39.7101, -104.219),('Dacono', 40.062, -104.9484),('Meeker', 40.0498, -107.8953),('Greenwood Village', 39.6152, -104.9131),('Greeley', 40.4151, -104.7705),('Deer Trail', 39.6157, -104.0435),('New Castle', 39.5785, -107.5262),('Rye', 37.9214, -104.9322),('Coaldale', 38.3563, -105.8155),('Dove Valley', 39.5741, -104.8289),('Wiley', 38.1554, -102.7193),('Eckley', 40.1126, -102.4885),('Orchard', 40.3319, -104.1178),('Glenwood Springs', 39.5455, -107.3347),('Fraser', 39.9303, -105.8031),('Alamosa', 37.4755, -105.877),('North La Junta', 37.9985, -103.5228),('Starkville', 37.1167, -104.5232),('Genoa', 39.2783, -103.4989),('Pine Brook Hill', 40.047, -105.3103),('Red Cliff', 39.5094, -106.3706),('Portland', 38.0892, -107.6952),('Hayden', 40.4852, -107.2423),('Fountain', 38.6888, -104.6829),('Beulah Valley', 38.0664, -104.9785),('La Veta', 37.5086, -105.0086),('Rocky Ford', 38.0499, -103.7227),('Sheridan Lake', 38.4667, -102.2941),('Rifle', 39.5362, -107.772),('Lochbuie', 40.0119, -104.7271),('Garfield', 38.5493, -106.2895),('Pritchett', 37.37, -102.8587),('Blanca', 37.4393, -105.5134),('Sedgwick', 40.9351, -102.5257),('Cotopaxi', 38.374, -105.6911),('Frisco', 39.5793, -106.0918),('Piedra', 37.4418, -107.1684),('Olney Springs', 38.1663, -103.9445),('Boulder', 40.0249, -105.2523),('Silt', 39.5478, -107.6536),('Fort Garland', 37.4279, -105.435),('Castle Pines Village', 39.4418, -104.897),('Phippsburg', 40.2301, -106.9509),('Branson', 37.0156, -103.8838),('Vona', 39.3023, -102.7435),('Berkley', 39.8045, -105.0281),('Flagler', 39.2955, -103.0767) ON CONFLICT DO NOTHING;",(err,res)=>{
    console.log(err,res)
  })

dbConfig.query("SELECT * FROM locations WHERE ns_coordinate > 40.0;",(err,res)=>{
  console.log(err,res)
  dbConfig.end()
})
