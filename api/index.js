'use strict';
// Libraries imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flag : 'w'});
var log_stdout = process.stdout;
// overload console.log to store logs in a file
console.log = function(d) {
	log_file.write(util.format(d) + '\n');
	log_stdout.write(util.format(d) + '\n');
};

// services
const peopleServices = require('./services/people.js');
const mapServices = require('./services/map.js')

const API_PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
// serve static page files
app.use(express.static('../app'));

// people
// map
// admin/sync => Active directory => Save in LevelDB


app.get('/test', peopleServices.test);
app.get('/people', peopleServices.getAllPeople);
app.get('/maps/:name', mapServices.getMap);

//app.get('/maps/:number', mapServices.getMapByNumber);

console.log('Initializing the API...');

var models = require("../models");

models.sequelize.sync().then(function () {
	app.listen(API_PORT, () => {
		console.log(`API listening on port ${API_PORT}`);

});
	app.on('error', onError);
	app.on('listening', onListening);
});

function onError(error) { /* ... */
	console.log("error : " + error)
}
function onListening() { /* ... */
	console.log("success !")
}


